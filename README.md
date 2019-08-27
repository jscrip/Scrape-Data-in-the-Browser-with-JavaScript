# JavaScript - Scrape a Bookstore with a Browser (Part 1)

## Goal: 
  Scrape the price, title, and product link for all 20 books on the following page:
  http://books.toscrape.com/catalogue/category/books/mystery_3/page-1.html

## Disclaimer: 
* The website used in this demo allows people to practice their web scraping skills. Outside this domain, you should ask for permission before scraping someones website.

## Requirements:
* A standard web browser. (Tested on Firefox)
* Copy and Paste skills

## Helpful Prerequisites:
* Some working knowledge of JavaScript / TypeScript (ES6)
* Experience with using Developer View / Console View 

### In this lesson, you’ll learn how to use JavaScript in the following ways:
* Extract text and links from HTML elements using CSS selectors
* Export the extracted information as JSON

## Instructions:
Go to this page: http://books.toscrape.com/catalogue/category/books/mystery_3/page-1.html
Open the web browser's console view
Copy and paste the contents of the js file or the code below into the console and press enter.

### Note: You might have to "allow pasting" in the browser due to potential security risks. There is no risk to running this code.

# Code:

```
(()=>{ var collection = [],  //IIFE followed by an empty array that will store the scraped data.  More info on immediately invoked function expressions: https://developer.mozilla.org/en-US/docs/Glossary/IIFE
  cleanText = (text) => text.replace(/[\n\s\t\r]+/gm," ").trim(), //a function that places a single space in place of any part of the string that contains line breaks, spaces, tabs, and/or return characters.
  textFromEl = (el, query, attr) => el.querySelector(query) ? cleanText(el.querySelector(query)[attr]) : "", //if el.querySelector(query) is truthy, then attempt to extract/clean the text, else return an empty string.
  books = document.querySelectorAll(".product_pod"); //select the book elements and store them in a list
  for (const book of books) { //Loop through each book and extract the title, price, and product link.
    var title = textFromEl(book,"h3", "textContent"), price = +textFromEl(book,".price_color", "textContent").replace("£",""), link =  textFromEl(book,"a", "href");
    collection.push({price,title,link}); //add extracted data to our book collection
  }
  console.log(collection); })(); //view the collection of books in the browser console.
 ```


# Result:

```
[{"price":"47.82","title":"Sharp Objects","link":"http://books.toscrape.com/catalogue/sharp-objects_997/index.html"},{"price":"19.63","title":"In a Dark, Dark ...","link":"http://books.toscrape.com/catalogue/in-a-dark-dark-wood_963/index.html"},{"price":"56.50","title":"The Past Never Ends","link":"http://books.toscrape.com/catalogue/the-past-never-ends_942/index.html"},{"price":"16.64","title":"A Murder in Time","link":"http://books.toscrape.com/catalogue/a-murder-in-time_877/index.html"},{"price":"44.10","title":"The Murder of Roger ...","link":"http://books.toscrape.com/catalogue/the-murder-of-roger-ackroyd-hercule-poirot-4_852/index.html"},{"price":"54.21","title":"The Last Mile (Amos ...","link":"http://books.toscrape.com/catalogue/the-last-mile-amos-decker-2_754/index.html"},{"price":"13.92","title":"That Darkness (Gardiner and ...","link":"http://books.toscrape.com/catalogue/that-darkness-gardiner-and-renner-1_743/index.html"},{"price":"10.69","title":"Tastes Like Fear (DI ...","link":"http://books.toscrape.com/catalogue/tastes-like-fear-di-marnie-rome-3_742/index.html"},{"price":"48.35","title":"A Time of Torment ...","link":"http://books.toscrape.com/catalogue/a-time-of-torment-charlie-parker-14_657/index.html"},{"price":"16.73","title":"A Study in Scarlet ...","link":"http://books.toscrape.com/catalogue/a-study-in-scarlet-sherlock-holmes-1_656/index.html"},{"price":"26.80","title":"Poisonous (Max Revere Novels ...","link":"http://books.toscrape.com/catalogue/poisonous-max-revere-novels-3_627/index.html"},{"price":"54.36","title":"Murder at the 42nd ...","link":"http://books.toscrape.com/catalogue/murder-at-the-42nd-street-library-raymond-ambler-1_624/index.html"},{"price":"35.28","title":"Most Wanted","link":"http://books.toscrape.com/catalogue/most-wanted_623/index.html"},{"price":"11.84","title":"Hide Away (Eve Duncan ...","link":"http://books.toscrape.com/catalogue/hide-away-eve-duncan-20_620/index.html"},{"price":"59.48","title":"Boar Island (Anna Pigeon ...","link":"http://books.toscrape.com/catalogue/boar-island-anna-pigeon-19_613/index.html"},{"price":"27.26","title":"The Widow","link":"http://books.toscrape.com/catalogue/the-widow_609/index.html"},{"price":"13.71","title":"Playing with Fire","link":"http://books.toscrape.com/catalogue/playing-with-fire_602/index.html"},{"price":"25.37","title":"What Happened on Beale ...","link":"http://books.toscrape.com/catalogue/what-happened-on-beale-street-secrets-of-the-south-mysteries-2_506/index.html"},{"price":"52.30","title":"The Bachelor Girl's Guide ...","link":"http://books.toscrape.com/catalogue/the-bachelor-girls-guide-to-murder-herringford-and-watts-mysteries-1_491/index.html"},{"price":"20.89","title":"Delivering the Truth (Quaker ...","link":"http://books.toscrape.com/catalogue/delivering-the-truth-quaker-midwife-mystery-1_464/index.html"}]
```
Homework / Future Lessons:
  Crawling and exporting paginated product data
  Request a web page with the Fetch API
  Parse the page with the DOMParser API
  Converting JSON to CSV
  Crawling the whole domain
  Downloading images
