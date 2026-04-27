const http = require('http');

function test(code, language) {
  return new Promise((resolve) => {
    const data = JSON.stringify({ code, language });
    const req = http.request({
      hostname: 'localhost',
      port: 3000,
      path: '/api/compile',
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(data) }
    }, (res) => {
      let body = '';
      res.on('data', c => body += c);
      res.on('end', () => {
        console.log(`\n=== ${language.toUpperCase()} ===`);
        console.log(JSON.parse(body));
        resolve();
      });
    });
    req.write(data);
    req.end();
  });
}

async function main() {
  // Test 1: Python - correct code (triangle area)
  await test(
    `a = 5
b = 6
c = 7
s = (a + b + c) / 2
area = (s*(s-a)*(s-b)*(s-c)) ** 0.5
print('The area of the triangle is %.2f' % area)`,
    'python'
  );

  // Test 2: Python - syntax error (incomplete code)
  await test(
    `def hello(
    print("hi")`,
    'python'
  );

  // Test 3: C - correct code
  await test(
    `#include <stdio.h>
int main() {
    int a = 10, b = 20;
    printf("Sum = %d\\n", a + b);
    return 0;
}`,
    'c'
  );

  // Test 4: C - compile error (missing semicolon)
  await test(
    `#include <stdio.h>
int main() {
    int a = 10
    printf("hello\\n");
    return 0;
}`,
    'c'
  );

  // Test 5: C++ - correct code
  await test(
    `#include <iostream>
using namespace std;
int main() {
    cout << "Hello from C++!" << endl;
    return 0;
}`,
    'cpp'
  );

  // Test 6: Java - correct code
  await test(
    `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello from Java!");
    }
}`,
    'java'
  );

  // Test 7: Java - compile error
  await test(
    `public class Main {
    public static void main(String[] args) {
        System.out.println("Missing closing brace")
    }
}`,
    'java'
  );
}

main();
