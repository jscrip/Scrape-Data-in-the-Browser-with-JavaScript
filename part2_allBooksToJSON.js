(async ()=>{ //async EIFE
	var collection = [], //an empty array for holding book data
	cleanText = (text) => text.replace(/[\n\s\t\r]+/gm," ").trim(), //replace new lines, spaces, tabs, and return characters with a space.
	textFromEl = (el, query, attr) => el.querySelector(query) ? cleanText(el.querySelector(query)[attr]) : "", //extract a chosen attribute inside a chosen element, given the query selector returns a truthy value
	pageGenerator = async function* (start,end){ //generate the number of pages to loop through.
			while (start <= end) { //keep looping until we reach the end
				yield start++; //pass the next number to the loop that called the generator.
	}},
	getDoc = async (url) => { //Use the Fetch API to request a a page, then use the DOMParser API to parse the page.
		var response = await fetch(url), //Request the page by url
			text = await response.text(), //Get the response in plain text
			parser = await new DOMParser(); //Create a new instance of the DOMParser
		return await parser.parseFromString(text, "text/html"); //Parse the response into HTML that can be queried.
	},
	getBooks = async (doc,cat) => { //extract the book data and add to the collection
		books = await doc.querySelectorAll(".product_pod"); //select books
		for await (const book of books) { //loop through each book and extract the details
			var title = await textFromEl(book,"h3 a", "title"), //get the book title
					price = await +textFromEl(book,".price_color", "textContent").replace("£",""), //get the book price
					link = 	await textFromEl(book,"a", "href"); //get the link for the book's product page
			collection.push({price,title,link,cat}); //add the book to the collection
	}},
	scrapePages = async (baseURL, firstPage, lastPage,cat) => { //Scrape paginated data
		for await (let num of pageGenerator(firstPage,lastPage)) { //loop through each page of the current category
			var url = await baseURL.replace("[num]",num), //create the url based on current page number
					doc = await getDoc(url); //return the requested page as a DOM object
			await getBooks(doc, num,cat); //extract the books from the DOM object
	};},
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
				lastPage > 1 ? await scrapePages(templateURL,2,lastPage,cat) : null; //if there are more pages in the category, get the books from those pages.
		};}; //end scrapeBooksByCategories()
	await scrapeBooksByCategories(); //get all the books by category
	console.log({collection}); //view the book collection in the developer console
})();
