---
title: "Instance vs Static: A tale of memory leaks and OOP in Python"
date: 2019-04-27
tags: [programming]
---

Object-Oriented Programming (OOP) teaches that classes can have 2 kinds of attributes: Instance and Static. Instance variables are attached to a specific instance of the class, and each has separate memory locations. Static variables are tied to the class itself, and are shared between instances.

The difference between the 2 can be seen clearly in OOP-purist languages like Java. `static` denotes that the variable is static and attached to the class directly.

```java
public class A {
    public static int staticIndex = 0;
    public int instanceIndex = 0;
}


A a = new A();
A b = new B();

a.staticIndex += 1;
a.instanceIndex += 1;
b.staticIndex += 1;
b.instanceIndex += 1;

a.staticIndex; // 2
a.instanceIndex; // 1
b.staticIndex; // 2
b.instanceIndex; // 1
A.staticIndex; // 2
```

As programming goes, this working exactly how it should. The static variable is shared between each instantiation.

Python, in its _infinite wisdom_, doesn't have any way of denoting whether a variable is static or not when defined at the class level, it just has variables. Taking the above code and mapping it as-is to Python yields some interesting results:

```python
class A():
    static_index = 0
    instance_index = 0


a = A()
b = B()

a.static_index += 1
a.instance_index += 1
b.static_index += 1
b.instance_index += 1


a.static_index  # 2
a.instance_index  # 2
b.static_index  # 2
b.instance_index  # 2
```

This is definitely not what's wanted. Because Python doesn't have any modifier for whether a variable is static, all variables defined at the class level are considered static. To create instance-level variables, these need to be defined in the constructor:

```python
class A():
    static_index = 0

    def __init__(self):
        self.instance_index = 0
```

This then works as expected.

## Memory leaks

Using a class to handle upstream API interaction is fairly common practice. However, if variables were defined on the class for convenience in defining their initial value or type, this could lead to unnecessary allocation and persistence.

Let's see an example:

```python
class APIWrapper():
    data = {'page': 0, 'items': []}

    def fetch_data():
        response = requests.get('https://api.com/items.json').json()
        self.data['items'].append(response['items'])
```

With the above _very simple_ example, we define a way of fetching data from an API, and access it using the `.data` attribute. In testing, this will almost certainly work fine. However, if the class gets re-instantiated, `data` persists between each instance, as it's technically static, and so the new instance already has the previous data, before fetching data. After the data has been fetched, `.data` now contains duplicate information.


In use cases such as web application (e.g. [Django](https://www.djangoproject.com/)), where threads are reused often to increase performance, this can lead to data persisting between responses, and hanging around in memory until the thread is disposed of (not technically true, but Python's GC is a whole separate discussion). There's no telling what madness could happen if this were mixed with `asyncio`.

If it were overriding the `'items'` list rather than appending to it, the issue wouldn't exist. If it were modifying specific keys of a dictionary, and only reusing those same keys, it would be missed just as easily, manifesting as simply higher than normal memory usage.

## The solution

There's 2 key ways of fixing the above code: either do OOP properly (in Python), or stop storing things at the object level entirely. I personally lean much more towards the latter, although it may involve a larger refactor.

```python

class APIWrapper():
    def __init__(self):
        self.data = {'page': 0, 'items': []}

    def fetch_data():
        response = requests.get('https://api.com/items.json').json()
        self.data['items'].append(response['items'])

# or...

class APIWrapper():
    def fetch_data():
        data = {'page': 0, 'items': []}
        response = requests.get('https://api.com/items.json').json()
        data['items'].append(response['items'])

```

Both of these solve the issue by recreating the `'items'` list for each instance of the variable, rather than once when the class is defined. This means when all references to the class are dropped, so too is the data related to it.

## The takeaway

If there's 1 thing to take from this, it's not to store things at the object level unless you really have to. Fetching from an API likely doesn't need to store the responses themselves on the instance, and definitely doesn't statically. Defining variables on the class and in the constructor do different things in Python vs other languages.
