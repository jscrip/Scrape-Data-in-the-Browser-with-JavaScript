/*
	JavaScript - Scrape a Bookstore with a Browser (Part 1)
	Author: jscript
	Website: jeremyb.me
	YouTube: https://www.youtube.com/channel/UCs-O7ij26oX_oc4F-p1CwKQ/
	Details: This is part of a tutorial on how to scrape data with JavaScript via web browser injection.
					 This code example extracts the title, price, and link for every book on this page:
					 http://books.toscrape.com/catalogue/category/books/mystery_3/page-1.html
					 Future Releases: This is part 1 on how to build a website scraper in your browser, from scratch.
	Tested on: FireFox 68
	Disclaimer: The website used in this demo allows people to practice their web scraping skills.
	 						Outside this domain, you should ask for permission before scraping someones website.
*/
var books = document.querySelectorAll(".product_pod"); //select all product container elements. Each element represents one product.
var collection = []; //setup an empty array to capture our scraped data
var getTextFromElement = (el, query) => { // When called, this function extracts and cleans the text inside the element that gets returned from the querySelector.
	try{
		return el.querySelector(query) ? el.querySelector(query).textContent.replace(/[£\n\s\t\r]+/gim," ").trim() : "";
		/*if the query returns a truthy value, then attempt to extract the text. If the query returns a falsey value, then return an empty string.
			Then put a space char in place of any string of characters from the text that is a currency marker, new line, space, tab, or return.
			Finally, trim any beginning or ending spaces from */
	}catch(error){
		console.log("There was a problem with retrieving text from an Element. ",error);
	}
};
for (const book of books) { //Loop through each book and add the book info to the collection.
	try{
  	var title = getTextFromElement(book,"h3"); //extract the name of the book
		var price = getTextFromElement(book,".price_color"); //extract the price of the book
		var link = book.querySelector("a").href; //extract the book's product page
	  collection.push({price,title,link}); //create an object containing title, price, and link, then add the object to the collection
	}catch(error){
		console.log("There was a problem with extracting data. ",error);
	}
}
console.log(collection); //view the collection of books in the browser console.
