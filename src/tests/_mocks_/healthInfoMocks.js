export const mockHealthData = {
    basic: {
      height: 170,
      weight: 70,
      bloodPressure: "120/80",
      bloodSugar: 95
    },
    chartData: {
      labels: ["1월", "2월", "3월"],
      datasets: [
        {
          label: "체중",
          data: [70, 69, 68]
        }
      ]
    }
  };
  
  export const mockHealthDataList = [
    {
      basic: {
        height: 170,
        weight: 70,
        bloodPressure: "120/80",
        bloodSugar: 95,
        date: "2024-01-01"
      }
    },
    {
      basic: {
        height: 170,
        weight: 69,
        bloodPressure: "118/78",
        bloodSugar: 92,
        date: "2024-01-02"
      }
    }
  ];