# 📈 ABCD Pattern Screener & Chart Pattern Visualization Platform

This project is a full-stack screener and charting tool for detecting and visualizing ABCD patterns — and ultimately, any custom chart patterns. Built with Python, Backtrader, PostgreSQL, and React, it features a custom HTML5 Canvas-based candlestick chart for interactive visualization.

The long-term goal is to provide a **flexible, open-source platform** where traders and developers can build and share their own pattern detectors while using the same powerful charting engine to visualize them.

---

## 🧠 Overview

At its core, this system does the following:

- Scans historical stock data for **ABCD patterns**
- Saves results to a **PostgreSQL database**
- Provides a **React frontend** to view and interact with pattern data
- Uses a **Canvas-based candlestick chart** to visually draw ABCD patterns
- Supports extensibility so **any pattern or dataset** can be visualized the same way

---

## 🧱 Tech Stack

- **Python + Backtrader** – Strategy engine for ABCD pattern detection
- **PostgreSQL** – Stores pattern data
- **React** – Frontend UI for browsing and viewing screener results
- **Canvas API** – Custom rendering for interactive candlestick charts
- **(Optional) Flask or FastAPI** – API layer between frontend and database

---

## 📊 What Is the ABCD Pattern?

The ABCD pattern is a well-known, reliable chart formation based on price symmetry. It consists of four points (A, B, C, D), where:

- AB and CD are typically equivalent price legs
- BC is a retracement of AB
- D often represents a reversal or continuation point

---

## 🚀 How It Works

### 1. Pattern Detection

The backend runs a Python script using Backtrader that:

- Loads OHLCV data for a symbol
- Identifies ABCD pattern candidates based on price and time symmetry
- Outputs a list of patterns to be stored

### 2. Data Storage

Each detected ABCD pattern is stored in a PostgreSQL database with detailed metadata. This schema supports flexible filtering, historical tracking, and visual rendering of chart patterns.

Each leg of the pattern includes precise date ranges and OHLC (Open, High, Low, Close) pricing:

#### A-Leg
- `pattern_A_start_date`
- `pattern_A_pivot_date`
- `pattern_A_end_date`
- `pattern_A_open`
- `pattern_A_high`
- `pattern_A_low`
- `pattern_A_close`

#### B-Leg
- `pattern_B_start_date`
- `pattern_B_pivot_date`
- `pattern_B_end_date`
- `pattern_B_open`
- `pattern_B_high`
- `pattern_B_low`
- `pattern_B_close`

#### C-Leg
- `pattern_C_start_date`
- `pattern_C_pivot_date`
- `pattern_C_end_date`
- `pattern_C_open`
- `pattern_C_high`
- `pattern_C_low`
- `pattern_C_close`

---

### 🔹 Pattern-Level Metrics

Additional computed values for each ABCD pattern include:

- `pattern_AB_start_date`
- `pattern_AB_end_date`
- `pattern_AB_bar_length`
- `pattern_ABC_start_date`
- `pattern_ABC_end_date`
- `pattern_ABC_bar_length`
- `pattern_BC_bar_length`
- `pattern_C_bar_retracement`
- `pattern_C_price_retracement`
- `pattern_ABCD_start_date`
- `pattern_ABCD_id` (unique identifier)

### 3. Visualization

The React frontend:

- Lists all detected patterns with filters
- Allows users to select a pattern and time frame
- Renders an interactive candlestick chart via HTML5 Canvas
- Overlays ABCD lines and labels on top of the chart

---

## 🌐 Open Source Vision & Extensibility

This project isn’t just about ABCD patterns — it’s a **foundation for detecting and visualizing any pattern**.

### 🔌 Pluggable Pattern Detection

Long term plan is to you will be able to build your own custom pattern detector and feed its output into the same database/charting layer.





