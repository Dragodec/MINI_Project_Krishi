export const sampleData = [
  {
    _id: "demo1",
    diseaseName: "Banana Bunchy Top Virus",
    cropName: "Banana",
    severity: "High",
    location: { district: "Wayanad", coordinates: [76.0821, 11.6854] },
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    _id: "demo2",
    diseaseName: "Rice Stem Borer",
    cropName: "Paddy",
    severity: "High",
    location: { district: "Palakkad", coordinates: [76.6534, 10.7867] },
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString()
  },
  {
    _id: "demo3",
    diseaseName: "Quick Wilt",
    cropName: "Black Pepper",
    severity: "Medium",
    location: { district: "Idukki", coordinates: [76.9746, 9.8500] },
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString()
  },
  {
    _id: "demo4",
    diseaseName: "Leaf Spot",
    cropName: "Coconut",
    severity: "Low",
    location: { district: "Kozhikode", coordinates: [75.7804, 11.2588] },
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString()
  },
  {
    _id: "demo5",
    diseaseName: "Abnormal Leaf Fall",
    cropName: "Rubber",
    severity: "Medium",
    location: { district: "Kottayam", coordinates: [76.5405, 9.5916] },
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString()
  },
  {
    _id: "demo6",
    diseaseName: "Blast Disease",
    cropName: "Paddy",
    severity: "High",
    location: { district: "Kuttanad", coordinates: [76.3861, 9.4246] },
    createdAt: new Date(Date.now() - 86400000 * 0.5).toISOString()
  },
  {
    _id: "demo7",
    diseaseName: "Yellow Vein Mosaic",
    cropName: "Okra",
    severity: "Low",
    location: { district: "Thrissur", coordinates: [76.2144, 10.5276] },
    createdAt: new Date(Date.now() - 86400000 * 6).toISOString()
  }
];
