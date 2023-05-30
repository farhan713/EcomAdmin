import { Menu } from './menu.model'; 



const userRole = localStorage.getItem("userType");
console.log(userRole);
let menuItems = []
if(localStorage.getItem("userType") == 'ADMIN') {
     menuItems = [ 
        new Menu (10, 'Dashboard', null, null, 'dashboard', null, true, 0),
        new Menu (11, 'Site Search', '/admin', null, 'dashboard', null, false, 10),
        new Menu (12, 'Recommendation', '/admin/rec-dashboard', null, 'dashboard', null, false, 10),
        new Menu (20, 'Site Search Setting', '/admin/sse-settings', null, 'perm_data_setting', null, false, 0),
        new Menu (30, 'Zero Search Results', '/admin/profile/zero-results', null, 'search', null, false, 0),
        new Menu (40, 'Top Searches', '/admin/top-searches', null, 'search', null, false, 0),
        new Menu (50, 'Keyword Breakdown', '/admin/keywords', null, 'translate', null, false, 0), 
        new Menu (60, 'Sorting Filter', '/admin/sorting', null, 'credit_card', null, false, 0), 
        new Menu (70, 'Custom Keywords', null, null, 'more_horiz', null, true, 0),
        new Menu (71, 'One-Way', '/admin/one-way', null, 'list_alt', null, false, 70), 
        new Menu (72, 'Grouped', '/admin/groupped', null, 'list_alt', null, false, 70),  
        new Menu (80, 'Manage recommendation', '/admin/profile/profile-list', null, 'settings_applications', null, false, 0), 
        new Menu (90, 'Recommendation Impact', '/admin/rec-results', null, 'restore', null, false, 0),  
        new Menu (91, 'Multi-tenant', null, null, 'Multi-tenant', null, true, 0),
        new Menu (82, 'Create Org', '/admin/sales/orders', null, 'Multi-tenant', null, false, 91),
        new Menu (93, 'Create Store', '/admin/sales/transactions', null, 'Multi-tenant', null, false, 91),
     
        new Menu (13, 'abcd', '/admin/add-user', null, 'local_atm', null, false, 0),
    ]
} else if(localStorage.getItem("userType") == 'CUSTOMER') {
    menuItems = [
        new Menu (10, 'Dashboard', null, null, 'dashboard', null, true, 0),
        new Menu (11, 'Site Search', '/admin', null, 'dashboard', null, false, 10),
        new Menu (12, 'Recommendation', '/admin/rec-dashboard', null, 'dashboard', null, false, 10),
        new Menu (20, 'Site Search Setting', '/admin/sse-settings', null, 'perm_data_setting', null, false, 0),
        new Menu (30, 'Zero Search Results', '/admin/profile/zero-results', null, 'search', null, false, 0),
        new Menu (40, 'Top Searches', '/admin/top-searches', null, 'search', null, false, 0),
     ]
} else if(localStorage.getItem("userType") == 'SUPER_ADMIN') {
    menuItems = [
        new Menu (10, 'Dashboard', null, null, 'dashboard', null, true, 0),
        new Menu (11, 'Site Search', '/admin', null, 'dashboard', null, false, 10),
        new Menu (12, 'Recommendation', '/admin/rec-dashboard', null, 'dashboard', null, false, 10),
        new Menu (20, 'Site Search Setting', '/admin/sse-settings', null, 'perm_data_setting', null, false, 0),
        new Menu (30, 'Zero Search Results', '/admin/profile/zero-results', null, 'search', null, false, 0),
        new Menu (40, 'Top Searches', '/admin/top-searches', null, 'search', null, false, 0),
        new Menu (50, 'Keyword Breakdown', '/admin/keywords', null, 'translate', null, false, 0), 
        new Menu (60, 'Sorting Filter', '/admin/sorting', null, 'credit_card', null, false, 0), 
        new Menu (70, 'Custom Keywords', null, null, 'more_horiz', null, true, 0),
        new Menu (71, 'One-Way', '/admin/one-way', null, 'list_alt', null, false, 70), 
        new Menu (72, 'Grouped', '/admin/groupped', null, 'list_alt', null, false, 70),  
        new Menu (80, 'Manage recommendation', '/admin/profile/profile-list', null, 'settings_applications', null, false, 0), 
        new Menu (90, 'Recommendation Impact', '/admin/rec-results', null, 'restore', null, false, 0),  
        new Menu (91, 'Multi-tenant', null, null, 'Multi-tenant', null, true, 0),
        new Menu (82, 'Create Org', '/admin/sales/orders', null, 'Multi-tenant', null, false, 91),
        new Menu (93, 'Create Store', '/admin/sales/transactions', null, 'Multi-tenant', null, false, 91),
     
        new Menu (13, 'abcd', '/admin/add-user', null, 'local_atm', null, false, 0),
     ]
}

export {menuItems}
