import { Platform } from "ionic-angular";
import { NgZone, EventEmitter } from "@angular/core";
import { PlatformVersion, PlatformConfig } from "ionic-angular/platform/platform";

export class MockPlatform extends Platform {
    zone: NgZone;
    Css: { transform?: string; transition?: string; transitionDuration?: string; transitionDelay?: string; transitionTimingFn?: string; transitionStart?: string; transitionEnd?: string; transformOrigin?: string; animationDelay?: string; };
    _platforms: string[];
    setWindow(win: Window): void {
        
    }
    win(): Window {
        return <any>{};
    }
    setDocument(doc: HTMLDocument): void {
        
    }
    doc(): HTMLDocument {
        return <any>{};
    }
    setZone(zone: NgZone): void {
        
    }
    setCssProps(docElement: HTMLElement): void {
        
    }
    is(platformName: string): boolean {
        return <any>{};
    }
    platforms(): string[] {
        return <any>{};
    }
    versions(): { [name: string]: PlatformVersion; } {
        return <any>{};
    }
    version(): PlatformVersion {
        return <any>{};
    }
    ready(): Promise<string> {
        return Promise.resolve("");
    }
    triggerReady(readySource: string): void {
        
    }
    prepareReady(): void {
        
    }
    setDir(dir: "ltr" | "rtl", updateDocument: boolean): void {
        
    }
    dir(): "ltr" | "rtl" {
        return <any>{};
    }
    isRTL: boolean;
    setLang(language: string, updateDocument: boolean): void {

    }
    lang(): string {
        return <any>{};
    }
    exitApp(): void {
        
    }
    backButton: EventEmitter<Event>;
    pause: EventEmitter<Event>;
    resume: EventEmitter<Event>;
    resize: EventEmitter<Event>;
    registerBackButtonAction(fn: Function, priority?: number): Function {
        return <any>{};
    }
    runBackButtonAction(): void {
        
    }
    setUserAgent(userAgent: string): void {
        
    }
    setQueryParams(url: string): void {
        
    }
    getQueryParam(key: string) {
        
    }
    url(): string {
        return <any>{};
    }
    userAgent(): string {
        return <any>{};
    }
    setNavigatorPlatform(navigatorPlt: string): void {
        
    }
    navigatorPlatform(): string {
        return <any>{};
    }
    width(): number {
        return <any>{};
    }
    height(): number {
        return <any>{};
    }
    getElementComputedStyle(ele: HTMLElement, pseudoEle?: string): CSSStyleDeclaration {
        return <any>{};
    }
    getElementFromPoint(x: number, y: number): HTMLElement {
        return <any>{};
    }
    getElementBoundingClientRect(ele: HTMLElement): ClientRect {
        return <any>{};
    }
    isPortrait(): boolean {
        return <any>{};
    }
    isLandscape(): boolean {
        return <any>{};
    }
    raf(callback: Function | ((timeStamp?: number) => void)): number {
        return <any>{};
    }
    cancelRaf(rafId: number) {
        
    }
    timeout(callback: Function, timeout?: number): number {
        return <any>{};
    }
    cancelTimeout(timeoutId: number): void {
        
    }
    registerListener(ele: any, eventName: string, callback: (ev?: UIEvent) => void, opts: EventListenerOptions, unregisterListenersCollection?: Function[]): Function {
        return <any>{};
    }
    transitionEnd(el: HTMLElement, callback: (ev?: TransitionEvent) => void, zone?: boolean): () => void {
        return <any>{};
    }
    windowLoad(callback: Function): void {
        
    }
    isActiveElement(ele: HTMLElement): boolean {
        return <any>{};
    }
    getActiveElement(): Element {
        return <any>{};
    }
    hasFocus(ele: HTMLElement): boolean {
        return <any>{};
    }
    hasFocusedTextInput(): boolean {
        return <any>{};
    }
    focusOutActiveElement(): void {
        
    }
    setPlatformConfigs(platformConfigs: { [key: string]: PlatformConfig; }): void {
        
    }
    getPlatformConfig(platformName: string): PlatformConfig {
        return <any>{};
    }
    registry(): { [name: string]: PlatformConfig; } {
        return <any>{};
    }
    setDefault(platformName: string): void {
        
    }
    testQuery(queryValue: string, queryTestValue: string): boolean {
        return <any>{};
    }
    testNavigatorPlatform(navigatorPlatformExpression: string): boolean {
        return <any>{};
    }
    matchUserAgentVersion(userAgentExpression: RegExp) {
        
    }
    testUserAgent(expression: string): boolean {
        return <any>{};
    }
    isPlatformMatch(queryStringName: string, userAgentAtLeastHas?: string[], userAgentMustNotHave?: string[]): boolean {
        return <any>{};
    }
    init(): void {
        
    }
}