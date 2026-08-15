import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Faq { q: string; a: string; open: boolean; }

@Component({
  selector: 'app-help',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.css'],
})
export class HelpComponent {
  faqs: Faq[] = [
    { q: 'How is utilization % calculated?', a: 'Utilized amount ÷ allocated amount, expressed as a percentage. Recalculated in real time as expenditures are recorded.', open: true },
    { q: 'Why did I get an under-utilization alert?', a: 'The system flags a budget when less than 40% has been spent while 70% or more of the financial year has elapsed.', open: false },
    { q: "Who can create a budget allocation?", a: 'Admin and Finance Officer roles. Department Heads can view their department\'s budgets and record expenditures.', open: false },
    { q: 'Can I export data?', a: 'Yes — the Reports page offers CSV export for budget utilization and expenditure detail reports.', open: false },
    { q: 'How often does the anomaly scan run?', a: "Automatically every 6 hours, plus on-demand via the 'Run Detection Scan' button on the Alerts page.", open: false },
    { q: 'What happens to a deactivated budget?', a: 'It is hidden from active lists but retained in the database for audit and historical reporting purposes.', open: false },
  ];

  toggle(f: Faq) { f.open = !f.open; }
}
