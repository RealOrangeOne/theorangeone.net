from tests import TestCase


class IndexPageTestCase(TestCase):
    def test_index_sections(self):
        for section in ['projects', 'recent-posts']:
            content = self.client.get('index.html')
            rows = content.find('div', id=section).find_all('div', class_='row')
            self.assertLessEqual(len(rows), self.settings['params']['index_items'])
            self.assertGreater(self.settings['params']['index_items'], 0)
            for row in rows:
                self.assertIsNotNone(row.find('section', class_='box'))
                self.assertTrue(self.client.exists(row.find('a').attrs['href']))
                self.assertNotEqual(self.get_children(row.find('p')), '')
                self.assertLessEqual(len(self.get_children(row.find('p'))), self.settings['params']['summary_length'])
                self.assertNotEqual(self.get_children(row.find('h3')), '')

