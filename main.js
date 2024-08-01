// @ts-check

const baseURL = new URL("https://apis.codante.io/olympic-games");

async function getCountries() {
  if (localStorage["countries"]) {
    return JSON.parse(localStorage["countries"]);
  } else {
    const countries = await fetch(baseURL + "/countries").then((response) =>
      response.text(),
    );

    localStorage["countries"] = countries;

    return JSON.parse(countries);
  }
}

/** @type {Object<string, any>} */
const countries = await getCountries();

const countriesTable = document.querySelector("#countries-table");

const html = String.raw;

function CountryRow(attributes) {
  const element = document.createElement("country-row");

  Object.entries(attributes).forEach(([key, value]) => {
    element.setAttribute(`country-${key}`, value);
  });

  return element;
}

if (countriesTable) {
  countries["data"].forEach((country) => {
    countriesTable.append(
      CountryRow({
        name: country["name"],
        flag: country["flag_url"],
      }),
    );
  });
}

customElements.define(
  "country-row",
  class extends HTMLElement {
    constructor() {
      super();
    }

    connectedCallback() {
      const row = document.createElement("tr");

      const name = document.createElement("td");

      const flag = document.createElement("img");
      flag.src = this.getAttribute("country-flag") ?? "";
      flag.alt = `${this.getAttribute("country-name")} flag`;

      name.append(flag);

      name.innerHTML += this.getAttribute("country-name");

      row.append(name);

      this.outerHTML = row.outerHTML;
    }
  },
);

export {};
