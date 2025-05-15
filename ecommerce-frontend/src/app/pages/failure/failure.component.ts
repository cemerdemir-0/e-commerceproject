import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-failure',
  standalone: false,
  templateUrl: './failure.component.html',
  styleUrl: './failure.component.scss'
})
export class FailureComponent implements OnInit{

  ngOnInit(): void {
    localStorage.removeItem("lastAddress"); // başarısızsa da sil
  }

}
