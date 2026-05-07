import urllib.request, http.cookiejar, json

cj = http.cookiejar.CookieJar()
opener = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(cj))

def request(method, path, data=None):
    req = urllib.request.Request(f'http://localhost:5173{path}', method=method)
    req.add_header('Content-Type', 'application/json')
    csrf_token = None
    for cookie in cj:
        if cookie.name == 'csrftoken':
            csrf_token = cookie.value
    if csrf_token:
        req.add_header('X-CSRFToken', csrf_token)
    if data:
        req.data = json.dumps(data).encode('utf-8')
    try:
        res = opener.open(req)
        return res.status, json.loads(res.read() or b'{}')
    except Exception as e:
        body = e.read().decode() if hasattr(e, 'read') else str(e)
        return e.code if hasattr(e, 'code') else 500, {'error': body}

request('GET', '/api/auth/csrf/')
request('POST', '/api/auth/login/', {'username': 'prof_sharma', 'password': 'Faculty123!'})
status, new_course = request('POST', '/api/faculty/courses/', {'title': 'Test Delete Enroll', 'short_description': 'test', 'long_description': 'test'})
course_id = new_course.get('id')

# Logout
request('POST', '/api/auth/logout/')
cj.clear()

# Login as student
request('GET', '/api/auth/csrf/')
request('POST', '/api/auth/login/', {'username': 'student1', 'password': 'Student123!'})
# Enroll
status, resp = request('POST', f'/api/courses/{course_id}/enroll/', {})
print('Enroll:', status, resp)

# Logout
request('POST', '/api/auth/logout/')
cj.clear()

# Login as faculty again
request('GET', '/api/auth/csrf/')
request('POST', '/api/auth/login/', {'username': 'prof_sharma', 'password': 'Faculty123!'})

# Delete Course
status, resp = request('DELETE', f'/api/faculty/courses/{course_id}/')
print('Delete:', status, resp)

