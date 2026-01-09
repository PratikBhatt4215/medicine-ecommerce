package com.medstore.constants;

public class ResponseCodes {
    // Error Codes (100 Series)
    public static final String USER_NOT_FOUND = "101";
    public static final String EMAIL_EXISTS = "102";
    public static final String USERNAME_EXISTS = "103";
    public static final String BAD_CREDENTIALS = "104";
    public static final String VALIDATION_FAILED = "105";
    public static final String INTERNAL_SERVER_ERROR = "106";
    public static final String MEDICINE_NOT_FOUND = "107";
    public static final String CART_ITEM_NOT_FOUND = "108";
    public static final String ORDER_CART_EMPTY = "109";
    public static final String ORDER_NOT_FOUND = "110";
    public static final String CATEGORY_NOT_FOUND = "111";
    public static final String WISHLIST_EXISTS = "112";
    public static final String RESOURCE_NOT_FOUND = "113";

    // Success Codes (200 Series)
    public static final String REGISTER_SUCCESS = "200";
    public static final String LOGIN_SUCCESS = "201";
    public static final String USER_PROFILE_RETRIEVED = "202";
    public static final String MEDICINES_RETRIEVED = "203";
    public static final String MEDICINE_RETRIEVED = "204";
    public static final String MEDICINE_CREATED = "205";
    public static final String MEDICINE_UPDATED = "206";
    public static final String MEDICINE_DELETED = "207";
    public static final String ORDERS_RETRIEVED = "208";
    public static final String ORDER_RETRIEVED = "209";
    public static final String ORDER_CREATED = "210";
    public static final String ORDER_UPDATED = "211";
    public static final String CART_RETRIEVED = "212";
    public static final String CART_ADDED = "213";
    public static final String CART_UPDATED = "214";
    public static final String CART_REMOVED = "215";
    public static final String CART_CLEARED = "216";
    public static final String CATEGORIES_RETRIEVED = "217";
    public static final String CATEGORY_RETRIEVED = "218"; // Category details retrieved
    public static final String CATEGORY_CREATED = "219";
    public static final String CATEGORY_UPDATED = "220";
    public static final String CATEGORY_DELETED = "221";
    public static final String WISHLIST_RETRIEVED = "222";
    public static final String WISHLIST_ADDED = "223";
    public static final String WISHLIST_REMOVED = "224";
    public static final String TIMEZONE_UPDATED = "225";
}
