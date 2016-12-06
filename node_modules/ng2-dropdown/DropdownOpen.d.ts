import { ElementRef, OnDestroy } from "@angular/core";
import { Dropdown } from "./Dropdown";
export declare class DropdownOpen implements OnDestroy {
    dropdown: Dropdown;
    private elementRef;
    /**
     * This hack is needed for dropdown not to open and instantly closed
     */
    private openedByFocus;
    private closeDropdownOnOutsideClick;
    constructor(dropdown: Dropdown, elementRef: ElementRef);
    openDropdown(): void;
    dropdownKeydown(event: KeyboardEvent): void;
    onFocus(): void;
    onBlur(event: FocusEvent): void;
    ngOnDestroy(): void;
    private close(event);
}
