function validateArea() {
  const areaInput = document.getElementById("area_btn");
  const areaError = document.getElementById("areaError");
  const estimateButton = document.querySelector(".submit");
  const price = document.getElementById("estimatedPrice");

  const areaValue = parseFloat(areaInput.value);

  if (areaValue < 1000) {
    areaError.textContent = "Area must be greater than 1000 square feet";
    areaError.style.color = "red"; 
    areaError.style.fontWeight = "bold"; 
    estimateButton.disabled = true;
    price.innerHTML = "";
  } else {
    areaError.textContent = ""; // Clear the error message
    estimateButton.disabled = false;
  }
}



function fetchLocations() {
  $.get("http://127.0.0.1:5000/get_location", function (data) {
      if (data && data.locations) {
          const locations = data.locations;
          const locationsDropdown = document.getElementById("locations");
          locationsDropdown.innerHTML = locations.map(loc => `<option value="${loc}">${loc}</option>`).join("");
      }
  });
}

function estimatePrice() {
  const sqft = parseFloat(document.getElementById("area_btn").value);
  const bhk = parseInt(document.querySelector('input[name="bhk"]:checked').value);
  const bathrooms = parseInt(document.querySelector('input[name="bathrooms"]:checked').value);
  const location = document.getElementById("locations").value;

  $.post("http://127.0.0.1:5000/predict_home_price", { total_sqft: sqft, bhk, bath: bathrooms, location }, function (data) {
      if (data && data.estimated_price) {
          let estimatedPrice = data.estimated_price;
          if (estimatedPrice >= 100) {
              // Convert to Crores and round to two decimal places
              estimatedPrice = (estimatedPrice / 100).toFixed(2);
              document.getElementById("estimatedPrice").innerHTML = `<h2>${estimatedPrice} Crores</h2>`;
          } else {
              // Round to two decimal places
              estimatedPrice = estimatedPrice.toFixed(2);
              document.getElementById("estimatedPrice").innerHTML = `<h2>${estimatedPrice} Lakhs</h2>`;
          }
      }
  });
}



window.onload = function () {
  fetchLocations();
  // document.getElementById("estimateBtn").addEventListener("click", estimatePrice);
  document.getElementById("estimatedPrice").addEventListener("click", estimatePrice);
};
