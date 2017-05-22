from tests import TestCase
from bs4 import BeautifulSoup


class CorePagesTestCase(TestCase):
    def test_has_index(self):
        content = self.client.get('index.html')
        self.assertTitle(content, 'Homepage')

    def test_has_sitemap(self):
        self.assertTrue(self.client.exists('sitemap.xml'))

    def test_has_atom_feed(self):
        self.assertTrue(self.client.exists('index.xml'))

    def test_has_robots(self):
        self.assertTrue(self.client.exists('robots.txt'))


class CommonPagesTestCase(TestCase):
    def test_navbar_links(self):
        content = self.client.get('index.html')
        tabs = content.find('nav').find_all('li', class_="top-level")
        self.assertEqual(len(tabs), 6)
        for tab in tabs:
            if len(tab.find_all('a')) == 1:
                self.assertEqual(len(tab.find_all('ul')), 0)
                self.assertTrue(self.client.exists(tab.find('a').attrs['href']))
            else:
                for link in tab.find_all('a'):
                    self.assertTrue(self.client.exists(link.attrs['href']))
                    self.assertNotEqual(self.get_children(link), '')
                    if self.get_children(link) == '<i>See more</i>':
                        self.assertEqual(link.attrs['href'], tab.find_all('a')[0].attrs['href'])


class TestClientTestCase(TestCase):
    def test_client_fails(self):
        with self.assertRaises(FileNotFoundError):
            self.client.get('foo.bar')

    def test_client_gets_data(self):
        content = self.client.get('index.html')
        self.assertIsInstance(content, BeautifulSoup)

    def test_file_exists(self):
        self.assertTrue(self.client.exists('index.html'))

    def test_build_path_without_index(self):
        self.assertEqual(
            self.client.build_path('foo/'),
            self.client.build_path('foo/index.html')
        )

    def test_file_doesnt_exist(self):
        self.assertFalse(self.client.exists('foo.bar'))
