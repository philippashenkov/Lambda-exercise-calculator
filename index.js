const express = require("express");
const app = express();

const PORT = process.env.PORT || 3000;
app.use(express.json());

const priceCalculation = (langType, mimetype = "none", count) => {
  let price = 0;

  const languageMultiplier =
    langType === "ru" || langType === "ua" ? 0.05 : 0.12;
  price += count * languageMultiplier;

  const minimumPrice =
    langType === "ru" || langType === "ua" ? 50 : 120;
  price = price < minimumPrice ? minimumPrice : price;

  const expectedDocTypes = ["doc", "docx", "rtf"];
  if (!expectedDocTypes.includes(mimetype)) {
    price *= 1.2;
  }

  return price;
};

const WORKING_HOURS = 9;
const WEEKEND_HOURS = 0;

const timeCalculation = (count, language) => {
  let workingHours = WORKING_HOURS;
  let symbolsPerHour = 333;
  if (language === "ru" || language === "ua") {
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

  const formattedDeadline =
    deadline.toLocaleDateString() + " " + deadline.toLocaleTimeString();
  return formattedDeadline;
};

/*JSON body post request
{
	"language": "en",
	"mimetype": "docx",
	"count": 10000
}
*/

app.post("/neworder", (req, res) => {
  const { language, mimetype, count } = req.body;
  const price = priceCalculation(language, mimetype, count);
  const deadline = timeCalculation(count, language);
  res.json({ price, deadline });
});

const start = async () => {
  try {
    app.listen(PORT, () => {
      console.log(`Server has been started at port ${PORT}.\n`);
    });
  } catch (e) {
    console.log(e);
  }
};

start();