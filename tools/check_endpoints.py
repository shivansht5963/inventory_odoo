import urllib.request
import urllib.error
import json
import time

# Give server a moment to start if needed
# (When run in same machine we usually can try straight away.)

base = 'http://127.0.0.1:8000'
paths = [
    '/',
    '/admin/',
    '/api/v1/auth/register/',
    '/api/v1/auth/login/',
    '/api/v1/auth/refresh/',
    '/api/v1/users/me/',
    '/api/v1/operations/',
    '/api/v1/operations/orders/',
    '/api/v1/catelog/',
    '/api/v1/catelog/products/',
    '/api/v1/catelog/skus/',
    '/api/v1/inventory/',
    '/api/v1/inventory/stock/',
    '/api/v1/inventory/transactions/',
]

results = []
for p in paths:
    url = base + p
    try:
        req = urllib.request.Request(url, method='GET', headers={'User-Agent': 'endpoint-checker/1.0'})
        with urllib.request.urlopen(req, timeout=5) as r:
            code = r.getcode()
            results.append({'path': p, 'url': url, 'status': code, 'ok': True})
    except urllib.error.HTTPError as e:
        # Server responded with HTTP error (e.g. 401, 403, 405, 404, 500)
        results.append({'path': p, 'url': url, 'status': e.code, 'reason': str(e), 'ok': e.code != 404})
    except Exception as e:
        # Connection refused / timeout / other
        results.append({'path': p, 'url': url, 'status': None, 'error': str(e), 'ok': False})

print(json.dumps(results))
