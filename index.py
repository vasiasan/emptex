import os
from google.appengine.ext import webapp
from google.appengine.ext.webapp import template
from google.appengine.ext.webapp.util import run_wsgi_app

class MainPage(webapp.RequestHandler):
  def get(self):

    template_values = {}

    path = os.path.join(os.path.dirname(__file__), 'static/regular/index.html')
    self.response.out.write(template.render(path, template_values))
    #print path

application = webapp.WSGIApplication([('/', MainPage)])

def main():
  run_wsgi_app(application)

if __name__ == "__main__":
  main()

