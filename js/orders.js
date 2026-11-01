// Apni Kirana - Order Tracking & Order History Manager

class OrdersManager {
  constructor() {
    this.trackingSteps = [
      { id: 'Placed', labelEn: 'Order Placed', labelHi: 'ऑर्डर सबमिट हुआ', icon: 'fa-file-invoice' },
      { id: 'Confirmed', labelEn: 'Order Confirmed', labelHi: 'ऑर्डर कन्फर्म हुआ', icon: 'fa-check-circle' },
      { id: 'Packing', labelEn: 'Packing in Kirana', labelHi: 'सामान पैक हो रहा है', icon: 'fa-box' },
      { id: 'Out for Delivery', labelEn: 'Out for Delivery', labelHi: 'डिलीवरी के लिए निकला', icon: 'fa-motorcycle' },
      { id: 'Delivered', labelEn: 'Delivered / Ready', labelHi: 'डिलीवर / तैयार है', icon: 'fa-house-circle-check' }
    ];
  }

  getTrackingStepIndex(status) {
    const idx = this.trackingSteps.findIndex(s => s.id === status);
    return idx >= 0 ? idx : 0;
  }

  renderTrackingTimeline(status, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const currentIdx = this.getTrackingStepIndex(status);
    const lang = window.LangEngine ? window.LangEngine.getLang() : 'en';

    let html = `<div class="tracking-timeline">`;
    this.trackingSteps.forEach((step, idx) => {
      const isCompleted = idx <= currentIdx;
      const isCurrent = idx === currentIdx;
      const label = lang === 'hi' ? step.labelHi : step.labelEn;

      html += `
        <div class="timeline-step ${isCompleted ? 'completed' : ''} ${isCurrent ? 'active' : ''}">
          <div class="step-icon">
            <i class="fas ${step.icon}"></i>
          </div>
          <div class="step-label">${label}</div>
        </div>
      `;
    });
    html += `</div>`;

    container.innerHTML = html;
  }
}

window.OrdersUI = new OrdersManager();
