const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch({
    headless: true
  });
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto('https://www.4devs.com.br/gerador_de_cpf', { waitUntil: "domcontentloaded"});
  await page.getByText('Não', { exact: true }).click();
  await page.locator('#cpf_estado').selectOption('AM');
  await page.getByLabel('Gerar CPF').click();

  const checkCpfStartsWith7 = async () => {
    const cpf = await page.textContent('#texto_cpf');
    return cpf.startsWith('7');
  };

  let cpfStartsWith7 = false;
  while (!cpfStartsWith7) {
    await page.getByLabel('Gerar CPF').click(); 
    await page.waitForTimeout(1000);
    cpfStartsWith7 = await checkCpfStartsWith7(); 
  }

  await page.screenshot({path: './tests-results/evidence.png', fullPage: true});
  await browser.close();
})();