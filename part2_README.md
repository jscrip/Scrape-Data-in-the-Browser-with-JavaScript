# JavaScript - Scrape a Bookstore with a Browser (Part 2)

## Goal: 
Scrape the price, title, category, and product link for all 1000 books on the following site:
- http://books.toscrape.com

## Disclaimer: 
The website used in this demo allows people to practice their web scraping skills. Outside this domain, you should ask for permission before scraping someone's website.

## Requirements:
* A standard web browser. (Tested on Firefox)
* Copy and Paste skills

## Helpful Prerequisites:
* Intermediate to Advanced JavaScript / TypeScript (ES6)
* * Variables, functions, strings, numbers, arrays, JSON, conditional statements, loops, and using native functions
* Fundamentals of CSS, CSS Selectors, and/or xpath selectors (document.querySelector & querySelectorAll)
* Experience with Developer View / Console View in Firefox/Chrome browser
* Fundamentals of Regular Expressions

### In this lesson, you’ll learn how to use JavaScript in the following ways:
* Extract text and links from HTML elements using CSS selectors
* Log the extracted information as JSON
* Control the order that pages are extracted with async & await
* Request additional pages using the Fetch API
* Fundamentals of parsing the DOM using the DOMParser API

## Instructions:
* Go to this page: http://books.toscrape.com
* Open the web browser's console view
* Copy and paste the contents of the js file or the code below into the console and press enter.

### Note: You might have to "allow pasting" in the browser due to potential security risks. There is no risk to running this code.

# Code:

```
(async ()=>{
	var collection = [],
	cleanText = (text) => text.replace(/[\n\s\t\r]+/gm," ").trim(),
	textFromEl = (el, query, attr) => el.querySelector(query) ? cleanText(el.querySelector(query)[attr]) : "",
	downloadCSV = (data) => { //export the book collection as a CSV file
		var jsonToCSV = (json) => { //convert the JSON data into a CSV string.
			var columns = json.reduce((result,d) => { //get a unique list of column names. This will be the first row of the CSV file.
				Object.keys(d).forEach(key => { //for each row, loop through each key
				result.add(key);}); //attempt to add the key (column name) into the Set. A Set can only contain unique values
				return result; //result = new Set() = where the column names are stored.
			},new Set()); //Tell the reduce function that the result is going to be a new Set()
			return [...columns].join(",") + json.reduce((result,d) => {
				result += "\n" + [...columns].map(key => typeof d[key] == "number" ? d[key] : typeof d[key] == "string" ? d[key].replace(",","⹁") : "").join(",")
				return result;
			},"");
		},
		csvDownload = jsonToCSV(data),
		exportFilename = "data.csv",
		csvData = new Blob([csvDownload], { type: 'text/csv;charset=utf-8;'});
		if (navigator.msSaveBlob) {
			navigator.msSaveBlob(csvData, exportFilename);
		} else {
			var link = document.createElement('a');
			link.href = window.URL.createObjectURL(csvData);
			link.setAttribute('download', exportFilename);
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
		};
	},
	pageGenerator = function* async (start,end){
			var i = start;
			while (i <= end) {
				yield i++;
	}},
	getDoc = async (url) => {
		var response = await fetch(url),
			text = await response.text(),
			parser = await new DOMParser();
		return await parser.parseFromString(text, "text/html");
	},
	getBooks = async (doc,num,cat) => {
		books = await doc.querySelectorAll(".product_pod");
		for await (const book of books) {
			var title = await textFromEl(book,"h3 a", "title"),
					price = await +textFromEl(book,".price_color", "textContent").replace("£",""),
					link = 	await textFromEl(book,"a", "href");
			collection.push({price,title,link,cat});
	}},
	scrapePages = async (baseURL, firstPage, lastPage,cat) => {
		for await (let num of pageGenerator(firstPage,lastPage)) {
			var url = await baseURL.replace("[num]",num),
					doc = await getDoc(url);
			await getBooks(doc, num,cat);
	};},
	scrapeBooksByCategories = async (categories) => {
		var url = `http://books.toscrape.com/catalogue/category/books/`,
		pageReference = '/page-[num].html';
		for await (let num of pageGenerator(0,categories.length-1)) {
		var category = categories[num],
			templateURL = url+category+pageReference,
			targetURL = templateURL.replace(pageReference,"/index.html"),
			doc = await getDoc(targetURL),
			lastPage = Math.ceil(+doc.querySelector(".form-horizontal > strong").textContent / 20),
			cat = category.split("_")[0];
		await getBooks(doc, 1, cat);
		lastPage > 1 ? await scrapePages(templateURL,2,lastPage,cat) : null;
	};},
	bookCategories = [...document.querySelectorAll(".side_categories > ul a")].map(el => {
		return el.href.replace("http://books.toscrape.com/catalogue/category/books/","").replace("/index.html","");
	});
	bookCategories.shift();
	await scrapeBooksByCategories(bookCategories);
	downloadCSV(collection);
})();
 ```

## Homework / Future Lessons:
  - Converting JSON to CSV
  - Crawling the whole domain by fetching links on crawled pages
  - Downloading images
