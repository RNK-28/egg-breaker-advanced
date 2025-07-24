let totalClicks = 0;
let spendableClicks = 0;
let clickPower = 1;
const clicksToBreak = 1000000;

const upgrades = {
  hammer: { cost: 50, power: 1, bought: false },
  smash: { cost: 200, power: 2, bought: false },
  lazer: { cost: 500, power: 3, bought: false },
  bomb: { cost: 1500, power: 4, bought: false },
  bigHammer: { cost: 5000, power: 5, bought: false },
  ultraSmash: { cost: 10000, power: 6, bought: false },
  megaDrill: { cost: 20000, power: 8, bought: false },
  eggTerminator: { cost: 50000, power: 12, bought: false },
  cosmicBlast: { cost: 100000, power: 20, bought: false }
};

function saveState() {
  const state = {
    totalClicks,
    spendableClicks,
    clickPower,
    upgrades,
    broken: document.getElementById("egg").classList.contains("broken")
  };
  localStorage.setItem("eggState", JSON.stringify(state));
}

function loadState() {
  const state = JSON.parse(localStorage.getItem("eggState") || "null");
  if (state) {
    totalClicks = state.totalClicks;
    spendableClicks = state.spendableClicks;
    clickPower = state.clickPower;
    for (let key in upgrades) {
      if (state.upgrades[key]?.bought) {
        upgrades[key].bought = true;
        const btn = document.querySelector(`button[data-upgrade="${key}"]`);
        if (btn) {
          btn.disabled = true;
          btn.innerText += " ✅ Purchased";
        }
      }
    }
    if (state.broken) {
      document.getElementById("egg").classList.add("broken");
      document.getElementById("apple").classList.remove("hidden");
    }
  }
  updateDisplay();
}

function updateDisplay() {
  document.getElementById("clicks").innerText =
    `Clicks: ${totalClicks.toLocaleString()} (Spendable: ${spendableClicks.toLocaleString()})`;
  saveState();
}

function clickEgg() {
  totalClicks += clickPower;
  spendableClicks += clickPower;
  animateEgg();
  if (totalClicks >= clicksToBreak) breakEgg();
  updateDisplay();
}

function animateEgg() {
  const egg = document.getElementById("egg");
  let scale = 1 + clickPower * 0.01;
  
  if (clickPower >= 20) {
    egg.style.boxShadow = "0 0 30px 10px rgba(255, 0, 255, 0.7)";
  } else if (clickPower >= 12) {
    egg.style.boxShadow = "0 0 20px 5px rgba(255, 215, 0, 0.7)";
  } else if (clickPower >= 8) {
    egg.style.boxShadow = "0 0 15px 3px rgba(0, 255, 255, 0.7)";
  }
  
  egg.style.transform = `scale(${scale})`;
  setTimeout(() => {
    egg.style.transform = "";
    egg.style.boxShadow = "0 8px 20px rgba(0,0,0,0.2)";
  }, 100);
}

function toggleStore() {
  const store = document.getElementById("store");
  store.classList.toggle("hidden");
  
  if (!store.classList.contains("hidden")) {
    store.scrollIntoView({ behavior: 'smooth' });
  }
}

function buyUpgrade(name) {
  const up = upgrades[name];
  if (up.bought) return alert(`${name} already purchased!`);
  if (spendableClicks < up.cost) return alert("Not enough spendable clicks!");
  spendableClicks -= up.cost;
  clickPower += up.power;
  up.bought = true;
  const btn = document.querySelector(`button[data-upgrade="${name}"]`);
  if (btn) {
    btn.disabled = true;
    btn.innerText += " ✅ Purchased";
  }
  alert(`${name.charAt(0).toUpperCase() + name.slice(1)} purchased! +${up.power} power!`);
  updateDisplay();
}

function breakEgg() {
  document.getElementById("egg").classList.add("broken");
  document.getElementById("apple").classList.remove("hidden");
  updateDisplay();
}

function checkCode() {
  const val = document.getElementById("codeInput").value.trim();
  if (val === "2809") {
    const amt = prompt("Code accepted! Enter number of clicks to add:");
    const num = parseInt(amt);
    if (!isNaN(num) && num > 0) {
      totalClicks += num;
      spendableClicks += num;
      if (totalClicks >= clicksToBreak) breakEgg();
      updateDisplay();
      alert(`${num.toLocaleString()} clicks added!`);
    } else {
      alert("Please enter a valid number.");
    }
  } else {
    alert("Wrong code!");
  }
}

function resetGame() {
  if (confirm("Are you sure you want to reset all progress?")) {
    localStorage.removeItem("eggState");
    location.reload();
  }
}

window.onload = loadState;
    // Check if we should show the intro animation
    if (!localStorage.getItem('animationShown')) {
        localStorage.setItem('animationShown', 'true');
        window.location.href = 'index.html';
    }
