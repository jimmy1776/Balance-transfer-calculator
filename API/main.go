package main

import (
	"github.com/gin-gonic/gin"

	"net/http"

	"fmt"

	"github.com/gin-contrib/cors"

)

type CalculationRequest struct {
	Balance             float64 `json:"balance"`
	APR                 float64 `json:"apr"`
	TransferFeePercent  float64 `json:"transfer_fee_percent"`
	Months              int     `json:"months"`
}

type CalculationResponse struct {
	InterestWithoutTransfer   string `json:"interest_without_transfer"`
	TransferFee               string `json:"transfer_fee"`
	MonthlyPaymentToPayOff    string `json:"monthly_payment_to_pay_off"`
	NetSavings                string `json:"net_savings"`
}


func calculate(c *gin.Context) {
	var req CalculationRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}

	interest := req.Balance * (req.APR / 100) * (float64(req.Months) / 12.0)
	transferFee := req.Balance * (req.TransferFeePercent / 100)
	monthlyPayment := (req.Balance + transferFee) / float64(req.Months)
	netSavings := interest - transferFee

	response := CalculationResponse{
		InterestWithoutTransfer: fmt.Sprintf("%.2f", interest),
		TransferFee: fmt.Sprintf("%.2f", transferFee),
		MonthlyPaymentToPayOff: fmt.Sprintf("%.2f", monthlyPayment),
		NetSavings: fmt.Sprintf("%.2f", netSavings),
	}
	

	c.JSON(http.StatusOK, response)
}

func main() {
	r := gin.Default()

	// 💥 Add this to handle CORS (including OPTIONS requests)
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000"},
		AllowMethods:     []string{"PUT", "PATCH", "POST", "DELETE", "GET"},
		AllowHeaders:     []string{"Content-Type"},
		AllowCredentials: true,
	}))

	r.POST("/calculate", calculate)

	r.Run(":8080")
}
