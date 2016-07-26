import urllib
import urllib2

requrl = "http://www.duomeidai.com/android_api/login"
test_data = {'phoneNumber':'15811372713','loginPassword':'111111'}

test_data_urlencode = urllib.urlencode(test_data)
req = urllib2.Request(url = requrl,data =test_data_urlencode)
res_data = urllib2.urlopen(req)
res = res_data.read()

print res

