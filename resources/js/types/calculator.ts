export interface CalculatorInputs {
    product_price: number;
    monthly_ad_spend: number;
    cpr: number;
    average_order_value: number;
    title?: string;
    notes?: string;
}

export interface ComputedResults {
    product_price: number;
    monthly_ad_spend: number;
    cpr: number;
    average_order_value: number;
    results_count: number;
    display_results_count: number;
    revenue: number;
    profit: number;
    roi_percentage: number;
    cpr_target: number;
    margin_per_result: number;
    revenue_per_result: number;
    roi_status: string;
    insights: string[];
}

export interface CalculationRecord {
    id: number;
    user_id: number;
    title: string | null;
    product_price: number | string;
    monthly_ad_spend: number | string;
    cpr: number | string;
    average_order_value: number | string;
    results_count: number | string;
    revenue: number | string;
    profit: number | string;
    roi_percentage: number | string;
    cpr_target: number | string;
    margin_per_result: number | string;
    notes: string | null;
    created_at: string;
    updated_at: string;
}
