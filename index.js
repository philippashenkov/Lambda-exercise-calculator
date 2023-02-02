const express = require("express")
const app = express()
 
const PORT = process.env.PORT || 3000
app.use(express.json())

const priceCalculation = (langType, mimetype="none"   , count) => {
  let price = 0;

  price +=
  langType === "ru" || langType === "ua"
      ? count * 0.05
      : count * 0.12;

  if (price < 50 && (langType === "ru" || langType === "ua"))
    price = 50;

  if (price < 120 && langType === "en") 
  price = 120;

  const expectedDocType = mimetype !=="doc" && mimetype !== "docx" && mimetype !== "rtf"
  if (expectedDocType) 
  price *= 1.2

  return price;
};

const WORKING_HOURS = 9;
const WEEKEND_HOURS = 0;

const timeCalculation = (count, language) => {
  let workingHours = WORKING_HOURS;
let symbolsPerHour = 333;
if (language === 'ru' || language === 'ua') {
symbolsPerHour = 1333;
}
workingHours = Math.ceil(count / symbolsPerHour);

let deadline = new Date();
let workingDays = Math.ceil(workingHours / WORKING_HOURS);

while (workingDays > 0) {
deadline.setDate(deadline.getDate() + 1);
if (deadline.getDay() === 0 || deadline.getDay() === 6) {
workingDays -= WEEKEND_HOURS;
} else {
workingDays -= 1;
}
}
  const formattedDeadline = deadline.toLocaleDateString() + " " + deadline.toLocaleTimeString();
  return formattedDeadline;
};

/*
{
	"language": "en",
	"mimetype": "docx",
	"count": 10000
}
*/
app.post("/neworder",  (req, res) => {
  const newOrder = req.body;
  const price = priceCalculation(
    newOrder.language,
    newOrder.mimetype,
    newOrder.count
  );
  const deadline = timeCalculation(newOrder.count, newOrder.language);
  res.json({price, deadline});
});

const start = async () => {
	try {
		app.listen(PORT, () => {
			console.log(`Server has been started at port ${PORT}.\n`)
		})
	} catch (e) {
		console.log(e)
	}
}

start()
