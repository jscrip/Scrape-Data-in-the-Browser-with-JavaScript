(async ()=>{ //async EIFE
	var collection = [], //an empty array for holding book data
	cleanText = (text) => text.replace(/[\n\s\t\r]+/gm," ").trim(), //replace new lines, spaces, tabs, and return characters with a space.
	textFromEl = (el, query, attr) => el.querySelector(query) ? cleanText(el.querySelector(query)[attr]) : "", //extract a chosen attribute inside a chosen element, given the query selector returns a truthy value
	downloadCSV = (data) => { //export the book collection as a CSV file
		var jsonToCSV = (json) => { //convert the JSON data into a CSV string.
			var columns = json.reduce((result,d) => { //get a unique list of column names. This will be the first row of the CSV file.
				Object.keys(d).forEach(key => { //for each row, loop through each key
				result.add(key);}); //attempt to add the key (column name) into the Set. A Set can only contain unique values
				return result; //result = new Set() = where the column names are stored.
			},new Set()); //Tell the reduce function that the result is going to be a new Set()
			return [...columns].join(",") + json.reduce((result,d) => {  //combine the columns and data into a single string and return
				result += "\n" + [...columns].map(key => typeof d[key] == "number" ? d[key] : typeof d[key] == "string" ? d[key].replace(",","⹁") : "").join(",")
				return result;
			},"");}, //jsonToCSV()
		csvDownload = jsonToCSV(data), //convert the JSON to a csv string
		exportFilename = "data.csv", //file name for the exported CSV
		csvData = new Blob([csvDownload], { type: 'text/csv;charset=utf-8;'}); //convert the CSV string to a Blob
		if (navigator.msSaveBlob) {
			navigator.msSaveBlob(csvData, exportFilename); // if msSaveBlob is a feature, use it to save the blob as a CSV file
		} else { //otherwise use the following method to save the blob as a CSV file
			var link = document.createElement('a'); //create a new link
			link.href = window.URL.createObjectURL(csvData); //convert the blob into the href for the link
			link.setAttribute('download', exportFilename); //set the link to trigger a browser download with the chosen file name
			document.body.appendChild(link); //add the link to the page
			link.click(); //click the link to trigger the download
			document.body.removeChild(link); //remove the link
		};},
	pageGenerator = async function* (start,end){ while (start <= end) { yield start++; }},//keep looping until we reach the end
	getDoc = async (url) => {
		var response = await fetch(url), //Request the page by url
				text = await response.text(), //Get the response in plain text
				parser = await new DOMParser(); //Create a new instance of the DOMParser
		return await parser.parseFromString(text, "text/html");
	},//Parse the response into HTML that can be queried.
	getBooks = async (doc,cat) => { //extract the book data and add to the collection
			var books = await doc.querySelectorAll(".product_pod"); //select books
			for await (const book of books) { //loop through each book and extract the details
				var title = await textFromEl(book,"h3 a", "title"), //get the book title
						price = await +textFromEl(book,".price_color", "textContent").replace("£",""), //get the book price
						link = 	await textFromEl(book,"a", "href"); //get the link for the book's product page
				collection.push({price,title,link,cat});}}, //add the book to the collection
	scrapePages = async (baseURL, firstPage, lastPage,cat) => { //Scrape paginated data
			for await (let num of pageGenerator(firstPage,lastPage)) { //loop through each page of the current category
				var url = await baseURL.replace("[num]",num), //create the url based on current page number
						doc = await getDoc(url); //return the requested page as a DOM object
				await getBooks(doc, num,cat);};},//extract the books from the DOM object
	scrapeBooksByCategories = async () => { //Scrape all the books by category
			var categories = [...document.querySelectorAll(".side_categories > ul a")].map(el => { //get the list of categories
				return el.href.replace("http://books.toscrape.com/catalogue/category/books/","").replace("/index.html","");}), //extract the category from the URL so we can build paginated URLs for each
					url = `http://books.toscrape.com/catalogue/category/books/`, //base url for book categories
					pageReference = '/page-[num].html'; //another piece of the url to act as a page number placeholder
			for await (let num of pageGenerator(1,categories.length-1)) { //Loop through each category,
				var category = categories[num], //reference to the current category
					templateURL = url+category+pageReference, //build the link template
					targetURL = templateURL.replace(pageReference,"/index.html"), //re-build the index page for the current category
					doc = await getDoc(targetURL), //get the index page for the current category
					lastPage = Math.ceil(+doc.querySelector(".form-horizontal > strong").textContent / 20), //extract the number for the last page in this category
					cat = category.split("_")[0]; //clean up the category name for export
					await getBooks(doc, 1, cat); //get the books from the first page
					lastPage > 1 ? await scrapePages(templateURL,2,lastPage,cat) : null; };}; //if there are more pages in the category, get the books from those pages.
		await scrapeBooksByCategories(); //get all the books by category
		downloadCSV(collection); //export the collection as a CSV file
	})();
