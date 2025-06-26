import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { BreadcrumbService } from './service/breadcrumb.service';

@Component({
  selector: 'app-breadcrumb',
  standalone: false,
  templateUrl: './breadcrumb.component.html',
  styleUrl: './breadcrumb.component.css',
})
export class BreadcrumbComponent implements OnInit {
  currentPage: string = '';
  currentRoute: string = '';
  showPopup: boolean = false;
  caseRef: string | null = null;

  private hideButtonRoutes: string[] = [
    '/area-codes',
    '/services/service-types',
    '/client-group',
    '/cases/case-details',
    '/home',
    '/dashboard'
  ];

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private breadcrumbService: BreadcrumbService
  ) {}

  ngOnInit(): void {
    // Subscribe to caseRef changes
    this.breadcrumbService.caseRef$.subscribe((ref) => {
      this.caseRef = ref;
      this.updateBreadcrumb();
    });

    this.currentRoute = this.router.url;
    this.updateBreadcrumb();

    // Subscribe to route changes
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.currentRoute = event.urlAfterRedirects;

        // Clear caseRef if not on case-details page
        if (!this.currentRoute.includes('/cases/case-details')) {
          this.breadcrumbService.clearCaseRef();
        }

        this.updateBreadcrumb();
      });
  }

  updateBreadcrumb(): void {
    const breadcrumbs: string[] = [];
    let route = this.activatedRoute.root;

    while (route.firstChild) {
      route = route.firstChild;
      const routeSnapshot = route.snapshot;

      if (routeSnapshot.data['breadcrumb']) {
        breadcrumbs.push(routeSnapshot.data['breadcrumb']);
      } else if (routeSnapshot.params['id']) {
        breadcrumbs.push(`Details for ${routeSnapshot.params['id']}`);
      }
    }

    this.currentPage = breadcrumbs.join(' / ') || 'Dashboard / Home';

    // Only show caseRef on case-details route
    if (this.currentRoute.includes('/cases/case-details') && this.caseRef) {
      this.currentPage += ` / ${this.caseRef}`;
    }

    console.log('[BreadcrumbComponent] Breadcrumb:', this.currentPage);
  }

  openPopup() {
    this.showPopup = true;
  }

  closePopup() {
    this.showPopup = false;
  }

  get activePopup(): string | null {
    if (this.currentRoute.includes('/users')) return 'users';
    if (this.currentRoute.includes('/services/service-providers'))
      return 'service-providers';
    if (this.currentRoute.includes('/services/service-types'))
      return 'service-provider-types';
    if (this.currentRoute.includes('/services/services'))
      return 'services';
    if (this.currentRoute.includes('/client')) return 'client';
    if (this.currentRoute.includes('/cases')) return 'new';
    return null;
  }

  get showNewButton(): boolean {
    return !this.hideButtonRoutes.some((route) =>
      this.currentRoute.includes(route)
    );
  }
}
