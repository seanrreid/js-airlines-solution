const getFlights = async () => {
  const data = await fetch(
    "https://my.api.mockaroo.com/flight_logs.json?key=5776e910"
  ).then((response) => response.json());
  return data;
};

const generateRandomStatuses = (length) => {
  const statuses = [];
  for (let i = 0; i < length; i++) {
    statuses.push(Math.random() < 0.5 ? "ON TIME" : "CANCELLED");
  }
  return statuses;
};

document.addEventListener("DOMContentLoaded", async () => {
  const flights = await getFlights();
  const statuses = generateRandomStatuses(flights.length);

  const flightDetails = document.querySelector("#flightDetails tbody");
  const searchForm = document.querySelector("#searchForm");
  const searchResults = document.querySelector("#searchResults");
  const searchResultsTable = document.querySelector(
    "#searchResults table tbody"
  );

  const generateRow = (flight, index) => {
    return `
          <td class="airline">${flight.airline}</td>
          <td class="has-text-weight-bold">${flight.flight_number}</td>
          <td class="time">${flight.departure_time}</td>
          <td class="${
            statuses[index] === "CANCELLED" ? "cancelled" : "on_time"
          }">${statuses[index]}</td>
      `;
  };

  flights.map((flight, index) => {
    const detailsRow = document.createElement("tr");
    detailsRow.innerHTML = generateRow(flight, index);
    flightDetails.append(detailsRow);
  });

  const airline = document.querySelector('input[name="airline"]');
  const flightNumber = document.querySelector('input[name="flightNumber"]');

  airline.addEventListener("change", () => (flightNumber.value = ""));
  flightNumber.addEventListener("change", () => (airline.value = ""));

  searchForm.addEventListener("submit", (event) => {
    event.preventDefault();
    // All of this is gross - SR
    searchResultsTable.innerHTML = "";
    let filteredFlights = [];

    if (!!airline.value) {
      filterByAirline = flights.filter((flight) =>
        flight.airline.toLowerCase().includes(airline.value.toLowerCase())
      );
      filteredFlights = [...filterByAirline];
    }
    if (!!flightNumber.value) {
      filterByNumber = flights.filter(
        (flight) => flight.flight_number === Number(flightNumber.value)
      );
      filteredFlights = [...filterByNumber];
    }

    filteredFlights.map((flight, index) => {
      const detailsRow = document.createElement("tr");
      detailsRow.innerHTML = generateRow(flight, index);
      searchResultsTable.append(detailsRow);
      searchResults.classList.remove("hidden");
    });
  });
});
