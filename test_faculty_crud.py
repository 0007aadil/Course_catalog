import urllib.request, http.cookiejar, json

cj = http.cookiejar.CookieJar()
opener = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(cj))

def request(method, path, data=None):
    req = urllib.request.Request(f'http://localhost:5173{path}', method=method)
    req.add_header('Content-Type', 'application/json')
    # Extract CSRF token from cookies
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

# 1. Fetch CSRF token
request('GET', '/api/auth/csrf/')

# 2. Login
status, data = request('POST', '/api/auth/login/', {'username': 'prof_sharma', 'password': 'Faculty123!'})
print('Login:', status, data.get('username'))

# 3. Create Course
course_data = {
    'title': 'React Testing 101',
    'short_description': 'Test course',
    'long_description': 'This is a test course created via API.'
}
status, new_course = request('POST', '/api/faculty/courses/', course_data)
print('Create Course:', status, new_course.get('id', new_course))
course_id = new_course.get('id')

if course_id:
    # 4. Create Lesson
    lesson_data = {
        'title': 'Lesson 1: Intro',
        'content': 'Hello world',
        'order': 1
    }
    status, new_lesson = request('POST', f'/api/faculty/courses/{course_id}/lessons/', lesson_data)
    print('Create Lesson:', status, new_lesson.get('id', new_lesson))
    lesson_id = new_lesson.get('id')
    
    if lesson_id:
        # 5. Delete Lesson
        status, _ = request('DELETE', f'/api/faculty/courses/{course_id}/lessons/{lesson_id}/')
        print('Delete Lesson:', status)
        
    # 6. Delete Course
    status, _ = request('DELETE', f'/api/faculty/courses/{course_id}/')
    print('Delete Course:', status)

print('Done.')
