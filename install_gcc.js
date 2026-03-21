const PISTON = 'http://localhost:2000/api/v2';

async function main() {
  // Install GCC which provides both C and C++
  console.log('>>> Installing gcc 10.2.0 (provides C and C++)...');
  const res = await fetch(`${PISTON}/packages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ language: 'gcc', version: '10.2.0' }),
  });
  console.log(`Status: ${res.status}`);
  const data = await res.text();
  console.log(`Response: ${data.slice(0, 300)}`);

  // Wait
  console.log('\nWaiting 5s...');
  await new Promise(r => setTimeout(r, 5000));

  // List all runtimes
  console.log('\n>>> Listing installed runtimes...');
  const r2 = await fetch(`${PISTON}/runtimes`);
  const runtimes = await r2.json();
  console.log(`Total runtimes: ${runtimes.length}`);
  runtimes.forEach(rt => console.log(`  - ${rt.language} ${rt.version} (aliases: ${rt.aliases?.join(', ') || 'none'})`));

  // Test C
  console.log('\n>>> Testing C...');
  const cRes = await fetch(`${PISTON}/execute`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ language: 'c', version: '10.2.0', files: [{ content: '#include<stdio.h>\nint main(){printf("hello");return 0;}' }] }),
  });
  const cData = await cRes.json();
  console.log(`C stdout: "${cData.run?.stdout?.trim()}" | PASS: ${cData.run?.stdout?.trim() === 'hello'}`);

  // Test C++
  console.log('\n>>> Testing C++...');
  const cppRes = await fetch(`${PISTON}/execute`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ language: 'c++', version: '10.2.0', files: [{ content: '#include<iostream>\nint main(){std::cout<<"hello";return 0;}' }] }),
  });
  const cppData = await cppRes.json();
  console.log(`C++ stdout: "${cppData.run?.stdout?.trim()}" | PASS: ${cppData.run?.stdout?.trim() === 'hello'}`);
}

main().catch(e => { console.error(e); process.exit(1); });
