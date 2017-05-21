import unittest
import os.path
from bs4 import BeautifulSoup


class TestClient:
    output_path = os.path.realpath('./public')

    def get(self, path, JS=True):
        file_path = self.build_path(path)
        content = "".join(open(file_path).readlines())
        if file_path.endswith('html'):
            content = BeautifulSoup(content, 'html.parser')
            if JS:
                for script in content(["noscript"]):  # Remove noscript tags
                    script.extract()
        return content

    def build_path(self, path):
        if path.startswith('/'):
            path = path[1:]
        if path.endswith('/'):
            path += 'index.html'
        return os.path.join(self.output_path, path)

    def exists(self, path):
        return os.path.exists(self.build_path(path))


class TestCase(unittest.TestCase):
    client = TestClient()

    def get_children(self, content):
        return str(list(content.children)[0]).strip()

    def assertTitle(self, content, title):
        self.assertIn(title, content.title.string)

    def assertHeaderTitle(self, content, title):
        header_title = content.find('header').find('h2')
        self.assertIn(title, self.get_children(header_title))

    def assertSamePath(self, p1, p2):
        self.assertEqual(self.client.build_path(p1), self.client.build_path(p2))
