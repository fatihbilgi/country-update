const libphonenumber = require('libphonenumber-js');
const axios = require('axios');
require('dotenv').config();

async function fetchCountryItems() {
    try {
        const response = await axios.get(`${process.env.BITRIX_URL}/crm.contact.userfield.get`, {
            params: { id: 228 }
        });

        const countryMap = {};
        response.data.result.LIST.forEach(country => {
            countryMap[country.VALUE] = country.ID;
        });

        return countryMap;
    } catch (error) {
        console.error("Error fetching country list:", error);
        console.log("Error fetching country list:", error);
        return {};
    }
}

async function fetchContacts() {
    try {
        const now = new Date();
        now.setUTCHours(now.getUTCHours() + 3);
        const yesterday = new Date(now);
        yesterday.setUTCDate(yesterday.getUTCDate() - 1);
        const year = yesterday.getUTCFullYear();
        const month = String(yesterday.getUTCMonth() + 1).padStart(2, "0");
        const day = String(yesterday.getUTCDate()).padStart(2, "0");
        const startDate = `${year}-${month}-${day}T00:00:00+03:00`;
        const endDate = `${year}-${month}-${day}T23:59:59+03:00`;

        let allContacts = [];
        let start = 0;
        let hasMore = true;

        while (hasMore) {
            const response = await axios.get(`${process.env.BITRIX_URL}/crm.contact.list`, {
                params: {
                    filter: {
                        ">=DATE_CREATE": "2025-04-01T00:00:00+03:00",
                        "<DATE_CREATE": "2025-06-30T23:59:59+03:00",
                        "PHONE": "%",
                        "=UF_CRM_1591879765": ""
                    },
                    select: ["NAME", "LAST_NAME", "PHONE", "DATE_CREATE"],
                    order: { DATE_CREATE: "DESC" },
                    start: start
                }
            });

            const contacts = response.data.result;
            allContacts = allContacts.concat(contacts);

            if (contacts.length < 50) {
                hasMore = false;
            } else {
                start += 50;
            }
        }

        console.log(`Total contacts fetched: ${allContacts.length}`);

        return allContacts;

    } catch (error) {
        console.error("Error fetching contacts:", error);
        console.log("Error fetching contacts:", error);
        return [];
    }
}

async function updateContactCountry(contactId, countryId) {
    try {
        const response = await axios.post(`${process.env.BITRIX_URL}/crm.contact.update`, {
            id: contactId,
            fields: { "UF_CRM_1591879765": countryId }
        });

        if (response.data.result) {

        } else {
            console.error(`Failed to update contact ${contactId}`, response.data);
            console.log(`Failed to update contact ${contactId}`, response.data);
        }
    } catch (error) {
        console.error(`Error updating contact ${contactId}:`, error);
        console.log(`Error updating contact ${contactId}:`, error);
    }
}

const countryNameMapping = {
    "AF": "Afghanistan",
    "AL": "Albania",
    "DZ": "Algeria",
    "AS": "American Samoa",
    "AD": "Andorra",
    "AO": "Angola",
    "AI": "Anguilla",
    "AQ": "Antarctica",
    "AG": "Antigua and Barbuda",
    "AR": "Argentina",
    "AM": "Armenia",
    "AW": "Aruba",
    "AU": "Australia",
    "AT": "Austria",
    "AZ": "Azerbaijan",
    "BS": "Bahamas",
    "BH": "Bahrain",
    "BD": "Bangladesh",
    "BB": "Barbados",
    "BY": "Belarus",
    "BE": "Belgium",
    "BZ": "Belize",
    "BJ": "Benin",
    "BM": "Bermuda",
    "BT": "Bhutan",
    "BO": "Bolivia (Plurinational State of)",
    "BQ": "Bonaire, Sint Eustatius and Saba",
    "BA": "Bosnia and Herzegovina",
    "BW": "Botswana",
    "BV": "Bouvet Island",
    "BR": "Brazil",
    "IO": "British Indian Ocean Territory (the)",
    "BN": "Brunei Darussalam",
    "BG": "Bulgaria",
    "BF": "Burkina Faso",
    "BI": "Burundi",
    "CV": "Cabo Verde",
    "KH": "Cambodia",
    "CM": "Cameroon",
    "CA": "Canada",
    "KY": "Cayman Islands (the)",
    "CF": "Central African Republic",
    "TD": "Chad",
    "CL": "Chile",
    "CN": "China",
    "CX": "Christmas Island",
    "CC": "Cocos (Keeling) Islands (the)",
    "CO": "Colombia",
    "KM": "Comoros",
    "CD": "Congo, Democratic Republic of the",
    "CG": "Congo",
    "CK": "Cook Islands (the)",
    "CR": "Costa Rica",
    "HR": "Croatia",
    "CU": "Cuba",
    "CW": "Curaçao",
    "CY": "Cyprus",
    "CZ": "Czechia",
    "CI": "Côte d'Ivoire",
    "DK": "Denmark",
    "DJ": "Djibouti",
    "DM": "Dominica",
    "DO": "Dominican Republic",
    "EC": "Ecuador",
    "EG": "Egypt",
    "SV": "El Salvador",
    "GQ": "Equatorial Guinea",
    "ER": "Eritrea",
    "EE": "Estonia",
    "SZ": "Eswatini",
    "ET": "Ethiopia",
    "FK": "Falkland Islands (the) [Malvinas]",
    "FO": "Faroe Islands (the)",
    "FJ": "Fiji",
    "FI": "Finland",
    "FR": "France",
    "GF": "French Guiana",
    "PF": "French Polynesia",
    "TF": "French Southern Territories (the)",
    "GA": "Gabon",
    "GM": "Gambia",
    "GE": "Georgia",
    "DE": "Germany",
    "GH": "Ghana",
    "GI": "Gibraltar",
    "GR": "Greece",
    "GL": "Greenland",
    "GD": "Grenada",
    "GP": "Guadeloupe",
    "GU": "Guam",
    "GT": "Guatemala",
    "GG": "Guernsey",
    "GN": "Guinea",
    "GW": "Guinea-Bissau",
    "GY": "Guyana",
    "HT": "Haiti",
    "HM": "Heard Island and McDonald Islands",
    "VA": "Holy See (the)",
    "HN": "Honduras",
    "HK": "Hong Kong",
    "HU": "Hungary",
    "IS": "Iceland",
    "IN": "India",
    "ID": "Indonesia",
    "IR": "Iran (Islamic Republic of)",
    "IQ": "Iraq",
    "IE": "Ireland",
    "IM": "Isle of Man",
    "IL": "Israel",
    "IT": "Italy",
    "JM": "Jamaica",
    "JP": "Japan",
    "JE": "Jersey",
    "JO": "Jordan",
    "KZ": "Kazakhstan",
    "KE": "Kenya",
    "KI": "Kiribati",
    "KP": "Korea (Democratic People's Republic of)",
    "KR": "Korea, Republic of",
    "KW": "Kuwait",
    "KG": "Kyrgyzstan",
    "LA": "Lao People's Democratic Republic",
    "LV": "Latvia",
    "LB": "Lebanon",
    "LS": "Lesotho",
    "LR": "Liberia",
    "LY": "Libya",
    "LI": "Liechtenstein",
    "LT": "Lithuania",
    "LU": "Luxembourg",
    "MO": "Macao",
    "MG": "Madagascar",
    "MW": "Malawi",
    "MY": "Malaysia",
    "MV": "Maldives",
    "ML": "Mali",
    "MT": "Malta",
    "MH": "Marshall Islands",
    "MQ": "Martinique",
    "MR": "Mauritania",
    "MU": "Mauritius",
    "YT": "Mayotte",
    "MX": "Mexico",
    "FM": "Micronesia (Federated States of)",
    "MD": "Moldova, Republic of",
    "MC": "Monaco",
    "MN": "Mongolia",
    "ME": "Montenegro",
    "MS": "Montserrat",
    "MA": "Morocco",
    "MZ": "Mozambique",
    "MM": "Myanmar",
    "NA": "Namibia",
    "NR": "Nauru",
    "NP": "Nepal",
    "NL": "Netherlands",
    "NC": "New Caledonia",
    "NZ": "New Zealand",
    "NI": "Nicaragua",
    "NE": "Niger",
    "NG": "Nigeria",
    "NU": "Niue",
    "NF": "Norfolk Island",
    "MP": "Northern Mariana Islands (the)",
    "NO": "Norway",
    "OM": "Oman",
    "PK": "Pakistan",
    "PW": "Palau",
    "PS": "Palestine, State of",
    "PA": "Panama",
    "PG": "Papua New Guinea",
    "PY": "Paraguay",
    "PE": "Peru",
    "PH": "Philippines",
    "PN": "Pitcairn",
    "PL": "Poland",
    "PT": "Portugal",
    "PR": "Puerto Rico",
    "QA": "Qatar",
    "MK": "North Macedonia",
    "RO": "Romania",
    "RU": "Russian Federation",
    "RW": "Rwanda",
    "RE": "Réunion",
    "BL": "Saint Barthélemy",
    "SH": "Saint Helena, Ascension and Tristan da Cunha",
    "KN": "Saint Kitts and Nevis",
    "LC": "Saint Lucia",
    "MF": "Saint Martin (French part)",
    "PM": "Saint Pierre and Miquelon",
    "VC": "Saint Vincent and the Grenadines",
    "WS": "Samoa",
    "SM": "San Marino",
    "ST": "Sao Tome and Principe",
    "SA": "Saudi Arabia",
    "SN": "Senegal",
    "RS": "Serbia",
    "SC": "Seychelles",
    "SL": "Sierra Leone",
    "SG": "Singapore",
    "SX": "Sint Maarten (Dutch part)",
    "SK": "Slovakia",
    "SI": "Slovenia",
    "SB": "Solomon Islands",
    "SO": "Somalia",
    "ZA": "South Africa",
    "GS": "South Georgia and the South Sandwich Islands",
    "SS": "South Sudan",
    "ES": "España",
    "LK": "Sri Lanka",
    "SD": "Sudan",
    "SR": "Suriname",
    "SJ": "Svalbard and Jan Mayen",
    "SE": "Sweden",
    "CH": "Switzerland",
    "SY": "Syrian Arab Republic",
    "TW": "Taiwan (Province of China)",
    "TJ": "Tajikistan",
    "TZ": "Tanzania, United Republic of",
    "TH": "Thailand",
    "TL": "Timor-Leste",
    "TG": "Togo",
    "TK": "Tokelau",
    "TO": "Tonga",
    "TT": "Trinidad and Tobago",
    "TN": "Tunisia",
    "TR": "Turkey",
    "TM": "Turkmenistan",
    "TC": "Turks and Caicos Islands (the)",
    "TV": "Tuvalu",
    "UG": "Uganda",
    "UA": "Ukraine",
    "AE": "United Arab Emirates",
    "GB": "United Kingdom of Great Britain and Northern Ireland",
    "UM": "United States Minor Outlying Islands (the)",
    "US": "United States of America",
    "UY": "Uruguay",
    "UZ": "Uzbekistan",
    "VU": "Vanuatu",
    "VE": "Venezuela (Bolivarian Republic of)",
    "VN": "Viet Nam",
    "VG": "Virgin Islands (British)",
    "VI": "Virgin Islands (U.S.)",
    "WF": "Wallis and Futuna",
    "EH": "Western Sahara",
    "YE": "Yemen",
    "ZM": "Zambia",
    "ZW": "Zimbabwe",
    "AX": "Åland Islands"
};

async function processContacts() {
    let count = 0;
    const countryMap = await fetchCountryItems();
    const contacts = await fetchContacts();

    for (const contact of contacts) {
        const phoneNumber = contact.PHONE?.[0]?.VALUE;
        if (!phoneNumber) continue;

        try {
            const parsedNumber = libphonenumber.parsePhoneNumber(phoneNumber);
            if (!parsedNumber) throw new Error("Invalid phone number format");

            const isoCountryCode = parsedNumber.country;
            if (!isoCountryCode) throw new Error("Could not determine country code");

            const countryName = countryNameMapping[isoCountryCode];
            if (!countryName) throw new Error(`No country name found for code: ${isoCountryCode}`);

            const countryId = countryMap[countryName];
            if (!countryId) throw new Error(`No country ID found for country: ${countryName}`);

            await updateContactCountry(contact.ID, countryId);
            count++;
        } catch (error) {
            console.error(`Skipping contact ID ${contact.ID} due to error: ${error.message}`);
            console.log(`Invalid phone number: ${phoneNumber}`);
        }
    }

    console.log("Processed contacts count: ", count);
}

processContacts();
