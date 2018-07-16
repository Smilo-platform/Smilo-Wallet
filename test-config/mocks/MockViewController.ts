import { ViewController, NavController, NavOptions, NavParams } from "ionic-angular";
import { ComponentRef, Renderer, ElementRef } from "@angular/core";
import { EventEmitter } from "events";
import { Content, Navbar, Footer, Header } from "ionic-angular/navigation/nav-interfaces";

export class MockViewController extends ViewController {
    component: any;
    _cmp: ComponentRef<any>;
    _nav: NavController;
    _zIndex: number;
    _state: number;
    _cssClass: string;
    _ts: number;
    willEnter: any;
    didEnter: any;
    willLeave: any;
    didLeave: any;
    willUnload: any;
    readReady: any;
    writeReady: any;
    data: any;
    instance: any;
    id: string;
    isOverlay: boolean;
    handleOrientationChange(): void {
        throw new Error("Method not implemented.");
    }
    init(componentRef: ComponentRef<any>): void {
        throw new Error("Method not implemented.");
    }
    _setNav(navCtrl: NavController): void {
        throw new Error("Method not implemented.");
    }
    _setInstance(instance: any): void {
        throw new Error("Method not implemented.");
    }
    subscribe(generatorOrNext?: any) {
        throw new Error("Method not implemented.");
    }
    emit(data?: any): void {
        throw new Error("Method not implemented.");
    }
    onDidDismiss(callback: (data: any, role: string) => void): void {
        throw new Error("Method not implemented.");
    }
    onWillDismiss(callback: (data: any, role: string) => void): void {
        throw new Error("Method not implemented.");
    }
    dismiss(data?: any, role?: string, navOptions?: NavOptions): Promise<any> {
        return Promise.resolve();
    }
    getNav(): NavController {
        throw new Error("Method not implemented.");
    }
    getTransitionName(_direction: string): string {
        throw new Error("Method not implemented.");
    }
    getNavParams(): NavParams {
        throw new Error("Method not implemented.");
    }
    setLeavingOpts(opts: NavOptions): void {
        throw new Error("Method not implemented.");
    }
    enableBack(): boolean {
        throw new Error("Method not implemented.");
    }
    name: string;
    index: number;
    isFirst(): boolean {
        throw new Error("Method not implemented.");
    }
    isLast(): boolean {
        throw new Error("Method not implemented.");
    }
    _domShow(shouldShow: boolean, renderer: Renderer): void {
        throw new Error("Method not implemented.");
    }
    getZIndex(): number {
        throw new Error("Method not implemented.");
    }
    _setZIndex(zIndex: number, renderer: Renderer): void {
        throw new Error("Method not implemented.");
    }
    pageRef(): ElementRef {
        throw new Error("Method not implemented.");
    }
    _setContent(directive: any): void {
        throw new Error("Method not implemented.");
    }
    getContent() {
        throw new Error("Method not implemented.");
    }
    _setContentRef(elementRef: ElementRef): void {
        throw new Error("Method not implemented.");
    }
    contentRef(): ElementRef {
        throw new Error("Method not implemented.");
    }
    _setIONContent(content: Content): void {
        
    }
    getIONContent(): Content {
        throw new Error("Method not implemented.");
    }
    _setIONContentRef(elementRef: ElementRef): void {
        
    }
    getIONContentRef(): ElementRef {
        throw new Error("Method not implemented.");
    }
    _setHeader(directive: Header): void {
        
    }
    getHeader(): Header {
        throw new Error("Method not implemented.");
    }
    _setFooter(directive: Footer): void {
        throw new Error("Method not implemented.");
    }
    getFooter(): Footer {
        throw new Error("Method not implemented.");
    }
    _setNavbar(directive: Navbar): void {
       
    }
    getNavbar(): Navbar {
        throw new Error("Method not implemented.");
    }
    hasNavbar(): boolean {
        throw new Error("Method not implemented.");
    }
    setBackButtonText(val: string): void {
        throw new Error("Method not implemented.");
    }
    showBackButton(shouldShow: boolean): void {
        throw new Error("Method not implemented.");
    }
    _preLoad(): void {
        throw new Error("Method not implemented.");
    }
    _willLoad(): void {
        throw new Error("Method not implemented.");
    }
    _didLoad(): void {
        throw new Error("Method not implemented.");
    }
    _willEnter(): void {
        throw new Error("Method not implemented.");
    }
    _didEnter(): void {
        throw new Error("Method not implemented.");
    }
    _willLeave(willUnload: boolean): void {
        throw new Error("Method not implemented.");
    }
    _didLeave(): void {
        throw new Error("Method not implemented.");
    }
    _willUnload(): void {
        throw new Error("Method not implemented.");
    }
    _destroy(renderer: Renderer): void {
        throw new Error("Method not implemented.");
    }
    _lifecycleTest(lifecycle: string): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    _lifecycle(lifecycle: string): void {
        throw new Error("Method not implemented.");
    }
}