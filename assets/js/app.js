"use strict";

// DOM elements selection
const passwordDisplay = document.querySelector(".password_display");
const passwordPlaceholder = document.querySelector(".password_placeholder");
const passwordCopyText = document.querySelector(".copy_text");
const passwordCopyBtn = document.querySelector(".copy_btn");
const passwordForm = document.querySelector(".password_setting");
const charCount = document.querySelector(".char_count");
const lengthSlider = document.querySelector(".char_length_slider");
const checkBoxes = document.querySelectorAll("input[type=checkbox]");
const strengthDesc = document.querySelector(".strength_rating_text");
const strengthBars = document.querySelectorAll(".bar");

// Character sets for password generation
const characterSets = {
  uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  lowercase: "abcdefghijklmnopqrstuvwxyz",
  number: "0123456789",
  symbols: "!@#$%^&*()"
};

// Function to update slider value and style
function updateSlider() {
  const value = lengthSlider.value;
  charCount.textContent = value;
  
  const min = parseInt(lengthSlider.min);
  const max = parseInt(lengthSlider.max);
  const percentage = ((value - min) * 100) / (max - min);
  
  // Cross-browser compatible gradient styling
  lengthSlider.style.background = `linear-gradient(to right, var(--green) ${percentage}%, var(--dark-black) ${percentage}%)`;
}

// Function to reset strength bars styles
function resetBarsStyles() {
  strengthBars.forEach(function(bar) {
    bar.style.backgroundColor = "transparent";
    bar.style.borderColor = "var(--half-white)";
  });
}

// Function to style bars based on strength
function styleBars(bars, color) {
  bars.forEach(function(bar) {
    bar.style.backgroundColor = color;
    bar.style.borderColor = color;
  });
}

// Function to update password strength indicator
function updatePasswordStrength() {
  const length = parseInt(lengthSlider.value);
  const checkedOptions = Array.from(checkBoxes).filter(function(box) {
    return box.checked;
  }).length;
  
  let strength = {
    text: "TOO WEAK",
    level: 1,
    color: "var(--dark-orange)"
  };

  // Strength calculation logic
  if (length >= 12 && checkedOptions >= 3) {
    strength = { text: "STRONG", level: 4, color: "var(--green)" };
  } else if (length >= 8 && checkedOptions >= 2) {
    strength = { text: "MEDIUM", level: 3, color: "var(--light-yellow)" };
  } else if (length >= 6 && checkedOptions >= 1) {
    strength = { text: "WEAK", level: 2, color: "var(--light-orange)" };
  }

  resetBarsStyles();
  strengthDesc.textContent = strength.text;
  const barsToFill = Array.from(strengthBars).slice(0, strength.level);
  styleBars(barsToFill, strength.color);
}

// Function to generate password
function generatePassword(e) {
  e.preventDefault();
  
  let chars = "";
  const checkedBoxes = Array.from(checkBoxes).filter(function(box) {
    return box.checked;
  });
  
  // Validate at least one option is selected
  if (checkedBoxes.length === 0) {
    return;
  }

  // Build character pool
  checkedBoxes.forEach(function(box) {
    chars += characterSets[box.value];
  });

  let password = "";
  const length = parseInt(lengthSlider.value);
  
  // Generate random password
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    password += chars[randomIndex];
  }

  passwordPlaceholder.textContent = password;
}

// Function to copy password to clipboard
function copyPassword() {
  const password = passwordPlaceholder.textContent;
  
  // Cross-browser compatible copy method
  const textArea = document.createElement("textarea");
  textArea.value = password;
  document.body.appendChild(textArea);
  textArea.select();
  
  try {
    document.execCommand("copy");
    passwordCopyText.textContent = "COPIED";
    setTimeout(function() {
      passwordCopyText.textContent = "";
    }, 2000);
  } catch (err) {
    console.error("Failed to copy password:", err);
  }
  
  document.body.removeChild(textArea);
}

// Event listeners
lengthSlider.addEventListener("input", function() {
  updateSlider();
  updatePasswordStrength();
});

checkBoxes.forEach(function(checkbox) {
  checkbox.addEventListener("change", updatePasswordStrength);
});

passwordForm.addEventListener("submit", generatePassword);
passwordCopyBtn.addEventListener("click", copyPassword);

// Initialization
document.addEventListener("DOMContentLoaded", function() {
  updateSlider();
  updatePasswordStrength();
});

// Initial call to set correct slider value
updateSlider();
updatePasswordStrength();