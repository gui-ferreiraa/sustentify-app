package com.sustentify.sustentify_app.app.companies.enums;

public enum CompanyDepartment {
    ADMINISTRATIVE("Administrative"),
    SALES("Sales"),
    FINANCE("Finance"),
    HR("Human Resources"),
    MARKETING("Marketing"),
    IT("Information Technology"),
    PRODUCTION("Production"),
    LEGAL("Legal"),
    SUPPORT("Support"),
    LOGISTICS("Logistics"),
    RESEARCH_AND_DEVELOPMENT("Research and Development"),
    SUSTAINABILITY("Sustainability");

    private final String departmentName;

    // Constructor to initialize the department name
    CompanyDepartment(String departmentName) {
        this.departmentName = departmentName;
    }

    // Method to get the department name
    public String getDepartmentName() {
        return departmentName;
    }

    @Override
    public String toString() {
        return departmentName;
    }
}
