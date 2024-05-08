import Calendar from "./firebaseAPI/Calendar";
import "./style.css";

async function run() {
  let calendar: Calendar;
  try {
    calendar = await Calendar.build("tasks");
    console.log(calendar.getTask("47fb091c-a676-4462-88ca-dc57508a09e9"));
  } catch (err) {
    console.error("err", err);
  }
}

run();
