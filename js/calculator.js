/* ============================================
   BUILD IMARA - EMI & COST CALCULATOR
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {
  initEMICalculator();
  initCostCalculator();
});

/* ============================================
   EMI CALCULATOR
   ============================================ */
function initEMICalculator() {
  const calculator = document.getElementById('emi-calculator');
  if (!calculator) return;
  
  const loanAmountSlider = calculator.querySelector('#loan-amount');
  const interestRateSlider = calculator.querySelector('#interest-rate');
  const loanTenureSlider = calculator.querySelector('#loan-tenure');
  
  const loanAmountDisplay = calculator.querySelector('#loan-amount-display');
  const interestRateDisplay = calculator.querySelector('#interest-rate-display');
  const loanTenureDisplay = calculator.querySelector('#loan-tenure-display');
  
  const emiResult = calculator.querySelector('#emi-result');
  const totalInterestResult = calculator.querySelector('#total-interest-result');
  const totalAmountResult = calculator.querySelector('#total-amount-result');
  
  if (!loanAmountSlider || !interestRateSlider || !loanTenureSlider) return;
  
  function calculateEMI() {
    const principal = parseFloat(loanAmountSlider.value);
    const rate = parseFloat(interestRateSlider.value) / 100 / 12;
    const tenure = parseInt(loanTenureSlider.value) * 12;
    
    // EMI formula: [P x R x (1+R)^N] / [(1+R)^N - 1]
    const emi = principal * rate * Math.pow(1 + rate, tenure) / (Math.pow(1 + rate, tenure) - 1);
    const totalAmount = emi * tenure;
    const totalInterest = totalAmount - principal;
    
    // Update displays
    if (loanAmountDisplay) loanAmountDisplay.textContent = formatCurrency(principal);
    if (interestRateDisplay) interestRateDisplay.textContent = interestRateSlider.value + '%';
    if (loanTenureDisplay) loanTenureDisplay.textContent = loanTenureSlider.value + ' years';
    
    // Update results
    if (emiResult) emiResult.textContent = formatCurrency(Math.round(emi));
    if (totalInterestResult) totalInterestResult.textContent = formatCurrency(Math.round(totalInterest));
    if (totalAmountResult) totalAmountResult.textContent = formatCurrency(Math.round(totalAmount));
    
    // Update pie chart if exists
    updateEMIChart(principal, totalInterest);
  }
  
  // Add event listeners
  loanAmountSlider.addEventListener('input', calculateEMI);
  interestRateSlider.addEventListener('input', calculateEMI);
  loanTenureSlider.addEventListener('input', calculateEMI);
  
  // Initial calculation
  calculateEMI();
}

function updateEMIChart(principal, interest) {
  const chart = document.getElementById('emi-chart');
  if (!chart) return;
  
  const total = principal + interest;
  const principalPercent = (principal / total) * 100;
  const interestPercent = (interest / total) * 100;
  
  chart.style.background = `conic-gradient(
    var(--color-primary) 0deg ${principalPercent * 3.6}deg,
    var(--color-secondary) ${principalPercent * 3.6}deg 360deg
  )`;
}

/* ============================================
   COST CALCULATOR
   ============================================ */
function initCostCalculator() {
  const calculator = document.getElementById('cost-calculator');
  if (!calculator) return;
  
  const sqftInput = calculator.querySelector('#sqft-input');
  const planSelect = calculator.querySelector('#plan-select');
  const floorsSelect = calculator.querySelector('#floors-select');
  
  const baseCostResult = calculator.querySelector('#base-cost-result');
  const structuralCostResult = calculator.querySelector('#structural-cost-result');
  const finishingCostResult = calculator.querySelector('#finishing-cost-result');
  const totalCostResult = calculator.querySelector('#total-cost-result');
  
  if (!sqftInput || !planSelect) return;
  
  // Price per sqft for each plan
  const pricePerSqft = {
    eco: 3200,
    basic: 4200,
    modular: 6000,
    premium: 8500,
    luxury: 12000
  };
  
  // Cost breakdown percentages
  const costBreakdown = {
    structural: 0.45,   // 45% - Foundation, structure, roofing
    finishing: 0.35,    // 35% - Flooring, painting, electrical, plumbing
    fixtures: 0.20      // 20% - Fixtures, fittings, misc
  };
  
  function calculateCost() {
    const sqft = parseInt(sqftInput.value) || 1000;
    const plan = planSelect.value || 'modular';
    const floors = parseInt(floorsSelect?.value) || 1;
    
    const rate = pricePerSqft[plan] || pricePerSqft.modular;
    const totalSqft = sqft * floors;
    const baseCost = totalSqft * rate;
    
    const structuralCost = baseCost * costBreakdown.structural;
    const finishingCost = baseCost * costBreakdown.finishing;
    const fixturesCost = baseCost * costBreakdown.fixtures;
    
    // Update results
    if (baseCostResult) baseCostResult.textContent = formatCurrency(Math.round(baseCost));
    if (structuralCostResult) structuralCostResult.textContent = formatCurrency(Math.round(structuralCost));
    if (finishingCostResult) finishingCostResult.textContent = formatCurrency(Math.round(finishingCost + fixturesCost));
    if (totalCostResult) totalCostResult.textContent = formatCurrency(Math.round(baseCost));
    
    // Update breakdown chart
    updateCostBreakdown(structuralCost, finishingCost, fixturesCost);
    
    // Update timeline estimate
    updateTimelineEstimate(plan, floors);
  }
  
  // Add event listeners
  sqftInput.addEventListener('input', calculateCost);
  planSelect.addEventListener('change', calculateCost);
  if (floorsSelect) floorsSelect.addEventListener('change', calculateCost);
  
  // Initial calculation
  calculateCost();
}

function updateCostBreakdown(structural, finishing, fixtures) {
  const total = structural + finishing + fixtures;
  
  const structuralBar = document.querySelector('.breakdown-structural');
  const finishingBar = document.querySelector('.breakdown-finishing');
  const fixturesBar = document.querySelector('.breakdown-fixtures');
  
  if (structuralBar) structuralBar.style.width = (structural / total * 100) + '%';
  if (finishingBar) finishingBar.style.width = (finishing / total * 100) + '%';
  if (fixturesBar) fixturesBar.style.width = (fixtures / total * 100) + '%';
}

function updateTimelineEstimate(plan, floors) {
  const timelines = {
    eco: 10,
    basic: 11,
    modular: 12,
    premium: 14,
    luxury: 18
  };
  
  const baseMonths = timelines[plan] || 12;
  const totalMonths = baseMonths + (floors - 1) * 2;
  
  const timelineResult = document.querySelector('#timeline-result');
  if (timelineResult) {
    timelineResult.textContent = `${totalMonths}-${totalMonths + 2} months`;
  }
}

/* ============================================
   UTILITY FUNCTIONS
   ============================================ */
function formatCurrency(amount) {
  if (amount >= 10000000) {
    return '₹' + (amount / 10000000).toFixed(2) + ' Cr';
  } else if (amount >= 100000) {
    return '₹' + (amount / 100000).toFixed(2) + ' L';
  } else if (amount >= 1000) {
    return '₹' + (amount / 1000).toFixed(1) + 'K';
  }
  return '₹' + amount.toLocaleString('en-IN');
}

function formatNumber(num) {
  return num.toLocaleString('en-IN');
}

/* ============================================
   SHARE CALCULATION
   ============================================ */
function shareCalculation(type) {
  let message = '';
  
  if (type === 'emi') {
    const loanAmount = document.querySelector('#loan-amount-display')?.textContent || 'N/A';
    const emi = document.querySelector('#emi-result')?.textContent || 'N/A';
    const tenure = document.querySelector('#loan-tenure-display')?.textContent || 'N/A';
    
    message = `Build Imara EMI Calculation:\n` +
              `Loan Amount: ${loanAmount}\n` +
              `Tenure: ${tenure}\n` +
              `Monthly EMI: ${emi}\n\n` +
              `Calculate yours at: ${window.location.href}`;
  } else if (type === 'cost') {
    const total = document.querySelector('#total-cost-result')?.textContent || 'N/A';
    const plan = document.querySelector('#plan-select')?.value || 'modular';
    const sqft = document.querySelector('#sqft-input')?.value || '1000';
    
    message = `Build Imara Cost Estimate:\n` +
              `Plan: ${plan.charAt(0).toUpperCase() + plan.slice(1)}\n` +
              `Area: ${sqft} sqft\n` +
              `Estimated Cost: ${total}\n\n` +
              `Get your quote at: ${window.location.href}`;
  }
  
  // Open WhatsApp with pre-filled message
  const phone = '919999999999'; // Replace with actual number
  const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank');
}

/* ============================================
   EXPORT FUNCTIONS
   ============================================ */
window.calculateEMI = initEMICalculator;
window.calculateCost = initCostCalculator;
window.shareCalculation = shareCalculation;
window.formatCurrency = formatCurrency;
