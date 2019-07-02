import { Component, OnInit, Input, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CreateScriptService } from '../../_service/create-script.service';
import { CommentsService } from '../../_service/comments.service';
import { RevisionsService } from '../../_service/revisions.service';
import { Observable, Subject } from 'rxjs';
import { DiffResults } from '../../diff';
export interface DiffContent {
  leftContent: string;
  rightContent: string;
}

@Component({
  selector: 'app-script-view',
  templateUrl: './script-view.component.html',
  styleUrls: ['./script-view.component.sass']
})

export class ScriptViewComponent implements OnInit {
  public slides: any = [];
  public tutorials: any = [];
  private id: number;
  public comment = false;
  public revision = false;
  public comments: any = [];
  public revisions: any;
  public tutorialName: any;
  public slideId: number;
  public slideIdRev: number;
  public index: number = 0;
  public index2: number = 0;
  public overVal: boolean[] = [false];
  public revision_old;
  public revision_new;

  submitted = false;
  content: DiffContent = {
    leftContent: '',
    rightContent: ''
  };
  options: any = {
    lineNumbers: true,
    mode: 'xml'
  };

  contentObservable: Subject<DiffContent> = new Subject<DiffContent>();
  contentObservable$: Observable<DiffContent> = this.contentObservable.asObservable();

  @Input() nav: any;
  @ViewChild('tableRow') el: ElementRef;
  @ViewChild('newmodal') el2: ElementRef;
  public mystyle = {
    // display:hidden,
  }
  constructor(
    private route: ActivatedRoute,
    public createscriptService: CreateScriptService,
    public commentsService: CommentsService,
    public revisionsService: RevisionsService,
    private rd: Renderer2,
    public router: Router
  ) { }

  public mouseenter(i) {
    this.overVal[i] = true;
  }
  public mouseleave(i) {
    this.overVal[i] = false;
  }

  public viewScript() {
    this.createscriptService.getScript(
      this.id
    ).subscribe(
      (res) => {
        this.slides = res;
      },
    );
  }

  public getComment() {
    this.commentsService.getComment(
      this.slideId
    ).subscribe(
      (res) => {
        this.comments = res;
      },
    );
  }

  public postComment(comment) {
    this.commentsService.postComment(
      this.slideId,
      {
        "comment": comment
      }
    ).subscribe();
    this.getComment();
  }

  public viewComment(i) {
    this.el.nativeElement.querySelectorAll('tr')[this.index + 1].classList.remove('is-selected')
    this.index = i
    if (this.slideId != this.slides[i]['id']) {
      this.slideId = this.slides[i]['id']
      this.getComment();
      if (this.revision == true) {
        this.revision = false;
      }
      this.comment = true;
      this.el.nativeElement.querySelectorAll('tr')[i + 1].classList.add('is-selected')
    }
    else {
      if (this.comment == false) {
        if (this.revision == true) {
          this.revision = false;
        }
        this.comment = true;
        this.el.nativeElement.querySelectorAll('tr')[i + 1].classList.add('is-selected')
      }
      else {
        this.comment = false;
        this.el.nativeElement.querySelectorAll('tr')[i + 1].classList.remove('is-selected')
      }
    }
  }

  public viewModal(index) {
    this.index2 = index

    this.content.leftContent = this.revisions[index + 1]['cue'];
    this.content.rightContent = this.revisions[index]['cue'];

    // console.log(this.content.leftContent);
    // console.log(this.content.rightContent);

    this.submitComparison()

    this.el2.nativeElement.classList.add('is-active')
  }

  public sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
      if ((new Date().getTime() - start) > milliseconds) {
        break;
      }
    }
  }

  public hideModal() {
    this.el2.nativeElement.classList.remove('is-active')
  }

  public getRevison(i) {
    this.revisionsService.getRevisions(
      i
    ).subscribe(
      (res) => {
        this.revisions = res;
        this.revision_new = res;
        if (this.revisions.length == 0) {
          this.revisions = false;
        }
      },
    );
  }

  public viewRevision(i) {
    if (this.slideIdRev != i) {
      this.slideIdRev = i
      this.getRevison(i);
      if (this.comment == true) {
        this.comment = false;
      }
      this.revision = true;
    }
    else {
      if (this.revision == false) {
        if (this.comment == true) {
          this.comment = false;
        }
        this.revision = true;
      }
      else {
        this.revision = false;
      }
    }
  }

  public revert(reversionData) {
    // console.log(reversionData, this.id)

    window.location.reload();
    this.revisionsService.revertRevision(
      reversionData['id'],
      {
        "reversion_id": reversionData['reversion_id']
      }
    )

  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.id = +params['id'];
    });
    this.viewScript();
    this.tutorialName = this.route.snapshot.params['tutorialName'];
  }

  //diff on revisions
  public submitComparison() {
    // console.log(this.content)
    this.submitted = false;
    this.contentObservable.next(this.content);
    this.submitted = true;
  }

  public handleChange(side: 'left' | 'right', value: string) {
    console.log(side);

    switch (side) {
      case 'left':
        this.content.leftContent = 'value';
        break;
      case 'right':
        this.content.rightContent = value;
        break;
      default:
        break;
    }
  }

  // public onCompareResults(diffResults: DiffResults) {
  //   console.log('diffResults', diffResults);
  // }
}
