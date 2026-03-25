const PISTON = 'http://localhost:2000/api/v2';

const runtimes = [
  { language: 'python', version: '3.10.0' },
  { language: 'gcc', version: '10.2.0' },
  { language: 'java', version: '15.0.2' },
];

async function installRuntime(rt) {
  console.log(`\n>>> Installing ${rt.language} ${rt.version}...`);
  try {
    const res = await fetch(`${PISTON}/packages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(rt),
    });
    const data = await res.text();
    console.log(`    Status: ${res.status}`);
    console.log(`    Response: ${data.slice(0, 200)}`);
    return res.ok;
  } catch (err) {
    console.error(`    ERROR: ${err.message}`);
    return false;
  }
}

async function testRuntime(language, version, code) {
  console.log(`\n>>> Testing ${language}...`);
  try {
    const res = await fetch(`${PISTON}/execute`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ language, version, files: [{ content: code }] }),
    });
    const data = await res.json();
    const stdout = data.run?.stdout?.trim() || '';
    const stderr = data.run?.stderr || '';
    console.log(`    stdout: "${stdout}"`);
    if (stderr) console.log(`    stderr: "${stderr.slice(0, 100)}"`);
    return stdout === 'hello';
  } catch (err) {
    console.error(`    ERROR: ${err.message}`);
    return false;
  }
}

async function main() {
  // Check Piston is up
  console.log('=== Checking Piston API ===');
  try {
    const r = await fetch(`${PISTON}/runtimes`);
    const runtimes_list = await r.json();
    console.log(`Piston running. ${runtimes_list.length} runtimes installed.`);
  } catch (e) {
    console.error('Piston NOT reachable:', e.message);
    process.exit(1);
  }

  // Install runtimes
  console.log('\n=== Installing Runtimes ===');
  for (const rt of runtimes) {
    const ok = await installRuntime(rt);
    if (!ok) console.log(`    WARNING: ${rt.language} install may have failed`);
  }

  // Wait a moment
  console.log('\n=== Waiting 5s for runtimes to settle ===');
  await new Promise(r => setTimeout(r, 5000));

  // Verify installed runtimes
  console.log('\n=== Verifying Installed Runtimes ===');
  const r2 = await fetch(`${PISTON}/runtimes`);
  const installed = await r2.json();
  console.log(`Total runtimes: ${installed.length}`);
  for (const rt of installed) {
    console.log(`  - ${rt.language} ${rt.version}`);
  }

  // Test each language
  console.log('\n=== Testing Code Execution ===');
  const tests = [
    { lang: 'python', ver: '3.10.0', code: "print('hello')" },
    { lang: 'c', ver: '10.2.0', code: '#include<stdio.h>\nint main(){printf("hello");return 0;}' },
    { lang: 'c++', ver: '10.2.0', code: '#include<iostream>\nint main(){std::cout<<"hello";return 0;}' },
    { lang: 'java', ver: '15.0.2', code: 'public class Main{public static void main(String[] a){System.out.print("hello");}}' },
  ];

  const results = {};
  for (const t of tests) {
    results[t.lang] = await testRuntime(t.lang, t.ver, t.code);
    console.log(`    ${t.lang}: ${results[t.lang] ? 'PASS' : 'FAIL'}`);
  }

  // Check Ollama
  console.log('\n=== Checking Ollama ===');
  try {
    const ollamaRes = await fetch('http://localhost:11434/api/tags');
    const ollamaData = await ollamaRes.json();
    const models = ollamaData.models || [];
    console.log(`Ollama running. ${models.length} models found:`);
    models.forEach(m => console.log(`  - ${m.name}`));
    const hasDeepseek = models.some(m => m.name.includes('deepseek-coder'));
    console.log(`deepseek-coder available: ${hasDeepseek}`);
  } catch (e) {
    console.log(`Ollama NOT reachable: ${e.message}`);
    console.log('Hint API will use fallback messages.');
  }

  // Summary
  console.log('\n=== SUMMARY ===');
  console.log(`Python:  ${results['python'] ? 'PASS' : 'FAIL'}`);
  console.log(`C:       ${results['c'] ? 'PASS' : 'FAIL'}`);
  console.log(`C++:     ${results['c++'] ? 'PASS' : 'FAIL'}`);
  console.log(`Java:    ${results['java'] ? 'PASS' : 'FAIL'}`);
}

main().catch(e => { console.error(e); process.exit(1); });
