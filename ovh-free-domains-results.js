const container = document.querySelector('div[class="col-md-6 col-lg-12 col-xl-6"]');

const rows = container.querySelectorAll('tr');

let results = [];

for (const tr of rows) {
  if (tr.childElementCount < 4) {
    let domain = tr.querySelector('span.name--full');
    domain = domain.innerText;
    let price = tr.querySelector('strong');
    price = price.innerText;
    let next = tr.querySelector('small.text-right');
    next = next ? next.innerText : '';
    results.push(
      [
        domain,
        price
          .replace('zł', '')
          .replaceAll(' ', '')
          .trim(),
        next
          .replace('następnie', '')
          .replace('zł/rok', '')
          .replace(' ', '')
          .trim()
      ]
    );
  }
}

let csv = 'domain,cena,potem\n';

for (const row of data) {
  let line = '';
  for (const col of row) {
    line = line + '"' + col + '"' + ',';
  }
  csv = csv + line + '\n';
}
