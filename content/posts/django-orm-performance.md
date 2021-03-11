---
title: Django ORM Performance
date: 2020-06-07
tags: [programming, django]
image: unsplash:iR8m2RRo-z4
---

Django already does some pretty incredible things when it comes to performance, especially in the ORM layer. The lazy loading, fluent interface for querying means it'll only fetch the data you need, when you need it. But it can't handle everything for you, and often needs some help to work out what you're doing, and what exactly it can optimize. Performance isn't all about moving your computation into the database from python-land, or reducing the number of queries, but more often than not, it really helps.

Django has a fairly comprehensive page on improving database performance on [their website](https://docs.djangoproject.com/en/dev/topics/db/optimization/).

## Don't _necessarily_ be pythonic
Django structures itself to be very pythonic, following PEP and implementing itself to support very common interfaces, such as file writing. However, when it comes to the ORM, doing things in a pythonic kind of way can hurt performance in a fairly significant way.

### `len(Queryset)`
Almost all data structures in the python standard libraries and Django implement `__len__`, meaning their length can be determined using the built-in function `len`. Querysets implement `len`, but not in the most optimal way. When Django calls `len`, it fetches all the data out the database, converts it to a list, and checks the length of that. This makes perfect sense, but is often not exactly what we want it to do. If we want the number of items in a queryset, it's far faster to use `count`.

Let's look at a query.

```python
len(User.objects.all())
>>> 15250  # 0.621s
```

Generates the query:

```sql
SELECT "users_user"."password", "users_user"."last_login", "users_user"."is_superuser", "users_user"."id", "users_user"."created", "users_user"."modified", "users_user"."email", "users_user"."type", "users_user"."status" FROM "users_user";
```

This is very large, and involves fetching a large amount of data. If we let the database handle the counting, then we can see quite a difference:

```python
User.objects.count()
>>> 15250  # 0.103s
```

Generates the query:

```sql
SELECT COUNT(*) AS "__count" FROM "users_user";
```

A performance improvement of 6x is pretty impressive! The much smaller query lets the database handle the counting rather than Django, and just sends the final count back from the database, rather than the whole table's content.

### You probably don't need to iterate
Unless you need to do something very python-heavy, you probably don't need to iterate. If all you need to do is parse, aggregate, or group some data together, you can do it all in the database. Iterating over a queryset pulls all columns out the field at once, constructs the objects, and iterates over those. Rather than loading a queryset into memory all at once, you can use a database cursor with `.iterator()`, which gets each row one-by-one.

If you need to fetch a single field from a table, using `values_list` will fetch just the specified column, rather than all of them. If you pass it `flat=True`, it'll cast it to a flat iterable of the items.

If you're doing some which requires computation in python-land (calling out to other libraries etc), then be sure to use `.only` or `.defer` to either only fetch those fields, or not fetch them. Fields which haven't been fetched will be automatically fetched when required, however only 1 at a time, so be careful to define exactly the fields required, else it can result in an increase to the number of queries.

### `bulk_create`

The standard way to create a model instance is using `Model.objects.create`, which creates the instance, commits it to the database, and returns it. This is fine for creating single instances, but when creating a few hundred, it bombards your database with queries, and slows down both it and Django.

Thankfully, Django supports creating multiple objects, at once: `bulk_create`. This enables you to create an instance without committing it to the database, and then commit a load at once, in a single query. Models which haven't been committed don't have a primary key (`model.pk == None`), and so also won't appear when querying, until actually created.

```python
for i in range(3000):
	Model.objects.create()

# or...

my_models = []

for i in range(3000):
	my_models.append(Model())

Model.objects.bulk_create(my_models)
```

By default, Django will save all instances at once in a single query. Depending on the size of your table, and the number of models you're creating, this may not be useful, can can put unnecessary strain on your database. `bulk_create` accepts a second argument, `batch_size`, which creates the models in smaller chunks, which can be faster. Some databases have hard limits on the amount of data which can be sent in 1 go (e.g. [mysql](https://stackoverflow.com/questions/7942154/mysql-error-2006-mysql-server-has-gone-away)), which this also helps avoid.


### `.update`

I've seen it many times. Given a list of models, set all the values of property `X` to `Y`. If we were to just be pythonic, we'd iterate over the queryset, set the property, and call `.save()`. This equates to 1 SQL query per model, and another to fetch the data in the first place, which is far from ideal. Fortunately, we can leverage the power of the SQL `UPDATE` statement to do the whole thing in 1 query.

Querysets have an `.update` method, which takes the same arguments as `.filter`, but rather than filtering based on them, it updates the rows in the queryset based on the arguments.

```python
ToDo.objects.filter(is_completed=True).update(is_completed=False)
```

Simple, and a single query! But what if we want to update the value of 1 property to another?

```python
for todo in ToDo.objects.filter(is_completed=True):
	todo.modified = todo.created
	todo.save()

# becomes...

ToDo.objects.filter(is_completed=True).update(modified=F('created'))
```

And again, a single query! The `F` function is a placeholder, which is replaced with the specified value from each row. The `F` functions also support a limited set of operators, meaning to can do basic computation based on the value, and all done inside a single, much faster query.

```python
ToDo.objects.filter(is_completed=False).update(priority=F('priority') + 1)
```

The above will increment the value of `priority` for every row in the queryset. You can also combine multiple `F` objects in much the same way as above. The `F` function simply takes the name of a field, which can either be a table column, or an annotated value.

### `bulk_update`

Django 2.2 bought a great present, in the form of [`bulk_update`](https://docs.djangoproject.com/en/dev/ref/models/querysets/#bulk-update). If you need to do some more complex model changes, especially involving python code, `.update` won't work for you. Prior to 2.2 you had to keep calling `.save` on each instance you updated. Until now. `bulk_update` allows you to update a load of model instances at once in bulk, and in just 1 query (or at least chunked like `bulk_create`).

```python
updating_instances = []

for todo in ToDo.objects.filter(is_completed=True):
    todo.description = modify_description(todo.description)
    updating_instances.append(todo)

ToDo.objects.bulk_update(updating_instances, ['description'])
```

As you'll notice, `bulk_update` must be called with which fields are being updated. This makes it harder to use in situations where you don't know exactly which fields change, it's significantly faster than calling `.save` each time.

### _Is my object in this queryset?_

It's fairly common to need to find out if an object you already have is an in a queryset. As with many other built-in constructs, using `in` evaluates the queryset, fetches all its data, then does the contents check in python-land. Checking using a `.filter(id=obj.id).exists` is often much faster, and creates a far more minimal query:

```sql
SELECT (1) AS "a" FROM "users_user" WHERE (... AND "users_user"."id" = '12345') LIMIT 1;
```

## Direct foreign keys
It's fairly common to need to get a list of objects based on a related object by foreign key, such as `Entry.objects.filter(blog__id='12345')`. The above code reads as though it will do a subquery for the `Blog` objects with the primary key `12345`, then look for all the `Entry` objects with foreign keys to those. Django however is a bit smarter than that. Because you're filtering by the primary key of the blog, and that's what's used to reference the object in the foreign key, the sub query isn't necessary. This means that `blog__id='12345`, `blog_id='12345'` and `blog='12345'` all result in the exact same query.

This optimization doesn't work the other way. If you need to access the id of the `Blog` from its related `Entry`, use `blog_id`. Assuming the row was fetched in its entirety (which it is by default), this will result in 0 queries, as the field is already in memory. Doing `entry.blog.id` will result in a query to find all the `Blog`s which match the ID (which there should be only 1), and then get its id, which we already had:

```sql
SELECT "entry_entry"."id", "entry_entry"."created", "entry_entry"."modified" FROM "entry_entry" WHERE "entry_entry"."id" = '12345';
```

## Unconstrained subqueries
Unconstrained subqueries result in incredibly expensive single queries, which are difficult to diagnose and optimize. If a subquery returns a large amount of data, then it'll take up a lot of time and computation in the parent query, resulting in queries which should be fast, but are far from it.

For example, if we have a `ToDo`, which can be assigned to multiple people, and completed individually by each person, and we needed to know which to-dos from a subset haven't been completed by at least 1 person. The filter might look something like `some_todos.exclude(todoassignee__is_completed=True)`, which looks fine.

The query created by this will contain something like:

```sql
SELECT
       "todos_todo".*
FROM "todos_todo"
WHERE (NOT (("todos_todo"."id" IN
    (SELECT U1."todo_id" AS Col1
    FROM "todos_todoassignee" U1
    WHERE U1."is_completed" = TRUE)
)));
```

And again, this looks completely fine. However, it won't scale as the system grows. The subquery will return all `ToDo`s where the assignee is completed. If the system is large, this will be a very large list. The result of that query will then be used to filter the parent queryset, which again, if it's large, will take a while. If you combine this with any other filters required in the query, then it's easy to see how these queries can take minutes.

The solution to this is a little strange, and goes against what most people would consider optimization, a second query. If we pre-calculate the `ToDoAssignees` we care about, then the parent query will be much faster. Breaking up the query also allows other queries to be processed whilst we're doing things in python-land.

```python
completed_todoassignees = ToDoAssignee.objects.filter(todo__in=some_todos, is_completed=True)
some_todos.filter(todoassignee__in=completed_todoassignees)
```

This will result in the same list, but be far faster. Only the ids are fetched from `completed_todoassignees`, and are bundled into the query. A side effect from this is that we can reuse the `completed_todoassignees` in subsequent queries for free, as they'd already be fetched.

Depending on the size of the relationship, you may be doing multiple subqueries on the same table, which can also be optimized away using the above.

```python
ToDo.objects.filter(
	assignee__user__email='foo@bar.biz',
	assignee__is_completed=True,
	assignee__user__is_active=True
)

# becomes...

users = User.objects.filter(email='foo@bar.biz', is_active=True)
assignees = ToDoAssignee.objects.filter(users__in=users, is_completed=True)
ToDo.objects.filter(assignees__in=assignees)
```

This has now broken down from 1 large query with 3 separate subqueries, to 3, reasonably inexpensive queries.

## `prefetch_related` and `select_related`

Whenever someone talks about optimization in Django, 2 functions always come up: `prefetch_related` and `select_related`. These allow querysets to proactively fetch related fields and models to save additional queries during future evaluation, like serialization with [Django REST Framework](). `select_related` is used for relationships which resolve to 1 entry (like a foreign key). `prefetch_related` is used for when it resolves to many (many to many relationships and reverse foreign keys).

### The `Prefetch` helper class

When prefetching the related models, you may not want to fetch them all. Rather than doing an additional filter as you iterate, you can do the filter during the prefetch stage. The default can be considered to be `Model.objects.all()`, so passing a custom queryset can greatly reduce the number of entries fetched.

```python
ToDo.objects.all().prefetch_related(
    Prefetch('todoassignee', ToDoAssignee.objects.filter(is_completed=True), to_attr='competed_assignees'
)
```

The above will populate the `todoassignee` field with only the completed assignees, saving an additional filter when you iterate.

### Unnecessary prefetching

Calling `.filter`, `.get`, `.count` etc *will* always execute new queries, even on prefetched fields. When prefetched, it's actually faster, and preferred to use the python operations (`len`, `in` etc) over the database ones, otherwise it'll hit the database, ignoring the prefetch, making it redundant.

Whilst it does depend on private APIs, it is [possible detect if a field has been prefetched](https://stackoverflow.com/a/19651840/5134369), and adjust your iterations accordingly. If your iteration isn't generic, and you can depend on the fact it's prefetched, it's far better to do that!

## Don't pass everything down to the database

As much as I've just been saying that it's best to do everything in the database, that's not always the case. It's almost impossible to give a perfect answer for when you should and shouldn't pass things off to the database, and when you should do them in python-land, it's completely dependent on the project, your system setup, the shape of the data you're collecting, and what you need it for.

One of the largest reasons not to do something in the database is readability. Doing complex mathematical calculations in the database is certainly possible, but it's not especially easy to read. It's often much easier to read if you pull the calculation into python-land, and just fetch all the related fields you need correctly, or annotate the more complex ones.

If you need to count a queryset, and do things with it based on the count, it may actually be better to use `len`, as this will load the queryset once, and count it, meaning the future uses of the queryset will be from memory, rather than hitting the database.

## Diagnosing a query issue

It's all well and good knowing some good ways to fix slow queries, locating the issue may be an issue.

### Printing

As with all software debugging, one of the easiest ways to debug is to just print things! Assuming you have a logging system which is fairly timely (the built-in dev server works fine for this), simply printing between the expensive parts may help narrow down exactly where is causing the issue. Sometimes the simplest solutions are a good place to start!

### Logging queries

If you already know which queries are slow, but need to see what the ORM is doing, printing the queries is another option. Querysets have a `query` property which stores the underlying query, and casting that to a string, before printing it, will display the raw SQL being executed. With this, you may be able to find issues with over-fetching, or unconstrained and unnecessary subqueries.

Alternatively, instead of printing them yourself, you can have Django do it for you. Adding the below to your logging config will make Django print every query executed.

```
'django.db.backends': {
    'level': 'DEBUG',
    'handlers': ['console']
},
```

### `django-querycount`

By far my favourite way of measuring performance is with [`django-querycount`](https://github.com/bradmontgomery/django-querycount). This simple extension aggregates the number of queries that a request makes, and shows how many of them are duplicate. If you're dealing with a large view, then seeing these numbers can help work out if a change is actually making things better, and if it's actually worth making.

```
|------|-----------|----------|----------|----------|------------|
| Type | Database  |   Reads  |  Writes  |  Totals  | Duplicates |
|------|-----------|----------|----------|----------|------------|
| REQU |  default  |    7     |    4     |    11    |     1      |
|------|-----------|----------|----------|----------|------------|
| RESP |  default  |   4491   |    4     |   4495   |     40     |
|------|-----------|----------|----------|----------|------------|
Total queries: 4506 in 4.2189s
```


### `django-debug-toolbar`

One of the most common tools for gaining insight into performance is [`django-debug-toolbar`](https://github.com/jazzband/django-debug-toolbar). For any regular page, it adds a handy sidebar which shows additional information about queries executed, but also where the request spent most of its time, and template insight. Depending on your use-case, and how your application is set up, this might be the ideal tool, however may not be applicable if you're just using `rest-framework` (although there are ways of getting it to work).


## Conclusion

Performance is an ongoing battle. No matter how much work you put into it, there's _always_ more which could be done. It's also not always obvious how you can optimize it, especially during initial development. Given a slow view, if you use and implement everything I've said above, it's very possible it'll get slower. Use profiling techniques to work out what exactly the bottleneck is, and optimize just that, then repeat. Once the view is fast enough, it's OK to stop.

This is by no means the canonical guide for how to and not to optimize Django. There are some other fantastic ones:

- [Making smarter queries with advanced ORM resources](https://media.ccc.de/v/hd-127-making-smarter-queries-with-advanced-orm-resources)
- [Django's general performance docs](https://docs.djangoproject.com/en/2.0/topics/performance/)
- [Django's database optimization docs](https://docs.djangoproject.com/en/dev/topics/db/optimization/)
- [The problem with laziness: minimising performance issues caused by Django's implicit database queries](https://www.dabapps.com/blog/performance-issues-caused-by-django-implicit-database-queries/)
