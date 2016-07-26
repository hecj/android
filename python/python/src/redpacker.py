import httplib

url = "http://hecj.top"

conn = httplib.HTTPConnection("hecj.top")
conn.request(method="GET",url=url) 

response = conn.getresponse()
res= response.read()
print res