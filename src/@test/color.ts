for (let i = 0; i <= 255; i++) {
  const code = `\x1B[38;5;${i}m`;
  console.log(`${code}Texto colorido ${i}`);
}