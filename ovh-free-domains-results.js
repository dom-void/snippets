
let clicks = {
	successfull: 0,
	unsuccessfull: 0,
};
let clicked = false;
let prevShowMore;
let nextShowMore;
// let spinner = null;
const showMore = () => document.querySelector('button[class="oui-button oui-button_icon-right  oui-button_link"]');
const clicking = () => new Promise((resolve, reject) => {
	const clickButton = () => {
		spinner = null;
		setTimeout(() => {
			nextShowMore = showMore();
			// spinner = document.querySelector('[class="ooui-spinner oui-spinner_m"]');
			if (nextShowMore) {
				if (clicked && prevShowMore === nextShowMore) {
					console.log('%cfinished', 'background:magenta;color:white');
					resolve();
					return;
				}
				prevShowMore = showMore();
				prevShowMore.click();
				clicks.successfull++;
				clicked = true;
				clickButton();
			} else {
				clicks.unsuccessfull++;
				clicked = false;
				clickButton();
			}
		}, 1000);
	};
	clickButton();
});

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

for (const row of results) {
  let line = '';
  for (const [i, col] of row.entries()) {
    line = line + '"' + col + '"' + (i < 2 ? ',' : '');
  }
  csv = csv + line + '\n';
}
