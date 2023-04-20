// Enter the page: https://www.ovh.pl/order/webcloud/?#/webCloud/domain
// Copy the code below and paste it in the browser's console.
// Run the code by typing in the console: let csv = await getCsvContent('domain_name.com')

const getCsvContent = (domain) => {
  const domainFieldQuery = 'textarea[class^="bar-field__input"]';
  const searchButtonQuery = 'button[class="oui-button oui-button_l oui-button_primary"]';
  const showMoreQuery = 'button[class="oui-button oui-button_icon-right  oui-button_link"]';
  // const spinnerQuery = document.querySelector('[class="ooui-spinner oui-spinner_m"]');
  const containerQuery = '[id="domain-table-other-extensions-domains"]';

  let clicks = {
    successful: 0,
    unsuccessful: 0,
  };
  let clicked = false;
  let prevShowMore;
  let nextShowMore;

  const selectNode = (query) => document.querySelector(query);

  const setDomainQuery = (domain) => {
    let domainField = selectNode(domainFieldQuery);
    let searchButton = selectNode(searchButtonQuery);

    domainField.value = domain;
    searchButton.click();
  };

  const clicking = () => new Promise((res, rej) => {
    const clickButton = () => {
      setTimeout(() => {
        nextShowMore = selectNode(showMoreQuery);
        if (nextShowMore) {
          if (clicked && prevShowMore === nextShowMore) {
            const minutes = parseInt((clicks.successful + clicks.unsuccessful) / 60);
            const seconds = clicks.successful + clicks.unsuccessful - minutes * 60;
            console.log(`%cIt took ${minutes} minutes and ${seconds} seconds. The button was clicked ${clicks.successful} times.`, 'background:magenta;color:white');
            res(true);
            return;
          }
          prevShowMore = selectNode(showMoreQuery);
          prevShowMore.click();
          clicks.successful++;
          clicked = true;
          clickButton();
        } else {
          clicks.unsuccessful++;
          clicked = false;
          clickButton();
        }
      }, 1000);
    };
    clickButton();
  });

  const getAllResults = () => {
    const container = selectNode(containerQuery);
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

    return csv;
  };

  return new Promise(async (res, rej) => {
    setDomainQuery(domain);
    const clickingFinished = await clicking();
    let csv = getAllResults();
    if (clickingFinished && csv) {
      res(csv);
    } else {
      rej('not finished');
    }
  });
};