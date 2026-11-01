// Calibrated Typographic Checkpoints for Greek Alphabet (A - Ω)
// Centered in 320x320 canvas:
// Top line of uppercase letters: y ≈ 34% - 35%
// Middle bar / junction: y ≈ 56% - 58%
// Bottom baseline: y ≈ 78% - 80%

export const LETTER_WAYPOINTS = {
  'Α': [
    { id: 'peak', x: 50, y: 34, radius: 24, name: 'Κορυφή' },
    { id: 'left_leg', x: 33, y: 78, radius: 24, name: 'Αριστερό πόδι' },
    { id: 'right_leg', x: 67, y: 78, radius: 24, name: 'Δεξί πόδι' },
    { id: 'crossbar', x: 50, y: 58, radius: 12, name: 'Μεσαία οριζόντια γραμμή' },
  ],
  'Β': [
    { id: 'top_left', x: 36, y: 34, radius: 24, name: 'Πάνω αριστερά' },
    { id: 'bottom_left', x: 36, y: 78, radius: 24, name: 'Κάτω αριστερά' },
    { id: 'top_loop', x: 64, y: 44, radius: 24, name: 'Πάνω καμπύλη' },
    { id: 'middle', x: 42, y: 56, radius: 18, name: 'Μεσαία ένωση' },
    { id: 'bottom_loop', x: 66, y: 68, radius: 24, name: 'Κάτω καμπύλη' },
  ],
  'Γ': [
    { id: 'bottom_left', x: 40, y: 78, radius: 26, name: 'Κάτω κάθετη' },
    { id: 'top_left', x: 40, y: 35, radius: 26, name: 'Γωνία' },
    { id: 'top_right', x: 66, y: 35, radius: 26, name: 'Οριζόντια γραμμή' },
  ],
  'Δ': [
    { id: 'peak', x: 50, y: 34, radius: 24, name: 'Κορυφή' },
    { id: 'left_corner', x: 32, y: 78, radius: 24, name: 'Αριστερή γωνία' },
    { id: 'right_corner', x: 68, y: 78, radius: 24, name: 'Δεξιά γωνία' },
    { id: 'bottom_bar', x: 50, y: 78, radius: 16, name: 'Κάτω γραμμή' },
  ],
  'Ε': [
    { id: 'top_left', x: 36, y: 34, radius: 24, name: 'Πάνω αριστερά' },
    { id: 'bottom_left', x: 36, y: 78, radius: 24, name: 'Κάτω αριστερά' },
    { id: 'top_bar', x: 66, y: 34, radius: 24, name: 'Πάνω γραμμή' },
    { id: 'middle_bar', x: 58, y: 56, radius: 18, name: 'Μεσαία γραμμή' },
    { id: 'bottom_bar', x: 66, y: 78, radius: 24, name: 'Κάτω γραμμή' },
  ],
  'Ζ': [
    { id: 'top_left', x: 35, y: 34, radius: 24, name: 'Πάνω αριστερά' },
    { id: 'top_right', x: 65, y: 34, radius: 24, name: 'Πάνω δεξιά' },
    { id: 'bottom_left', x: 35, y: 78, radius: 24, name: 'Κάτω αριστερά' },
    { id: 'bottom_right', x: 65, y: 78, radius: 24, name: 'Κάτω δεξιά' },
  ],
  'Η': [
    { id: 'top_left', x: 36, y: 34, radius: 24, name: 'Πάνω αριστερά' },
    { id: 'bottom_left', x: 36, y: 78, radius: 24, name: 'Κάτω αριστερά' },
    { id: 'top_right', x: 64, y: 34, radius: 24, name: 'Πάνω δεξιά' },
    { id: 'bottom_right', x: 64, y: 78, radius: 24, name: 'Κάτω δεξιά' },
    { id: 'middle_bar', x: 50, y: 56, radius: 12, name: 'Μεσαία οριζόντια γραμμή' },
  ],
  'Θ': [
    { id: 'top', x: 50, y: 34, radius: 24, name: 'Κορυφή κύκλου' },
    { id: 'left', x: 32, y: 56, radius: 24, name: 'Αριστερά' },
    { id: 'bottom', x: 50, y: 78, radius: 24, name: 'Βάση κύκλου' },
    { id: 'right', x: 68, y: 56, radius: 24, name: 'Δεξιά' },
    { id: 'middle_line', x: 50, y: 56, radius: 12, name: 'Μεσαία γραμμή' },
  ],
  'Ι': [
    { id: 'top', x: 50, y: 34, radius: 24, name: 'Κορυφή' },
    { id: 'middle', x: 50, y: 56, radius: 24, name: 'Μέση' },
    { id: 'bottom', x: 50, y: 78, radius: 24, name: 'Βάση' },
  ],
  'Κ': [
    { id: 'top_left', x: 36, y: 34, radius: 24, name: 'Πάνω κάθετη' },
    { id: 'bottom_left', x: 36, y: 78, radius: 24, name: 'Κάτω κάθετη' },
    { id: 'middle_branch', x: 42, y: 56, radius: 18, name: 'Σημείο ένωσης' },
    { id: 'top_right', x: 64, y: 34, radius: 24, name: 'Πάνω δεξιά' },
    { id: 'bottom_right', x: 64, y: 78, radius: 24, name: 'Κάτω δεξιά' },
  ],
  'Λ': [
    { id: 'peak', x: 50, y: 34, radius: 24, name: 'Κορυφή' },
    { id: 'left_foot', x: 33, y: 78, radius: 24, name: 'Αριστερό πόδι' },
    { id: 'right_foot', x: 67, y: 78, radius: 24, name: 'Δεξί πόδι' },
  ],
  'Μ': [
    { id: 'bottom_left', x: 32, y: 78, radius: 24, name: 'Κάτω αριστερά' },
    { id: 'top_left', x: 32, y: 34, radius: 24, name: 'Πάνω αριστερά' },
    { id: 'center_dip', x: 50, y: 60, radius: 18, name: 'Μεσαία μύτη' },
    { id: 'top_right', x: 68, y: 34, radius: 24, name: 'Πάνω δεξιά' },
    { id: 'bottom_right', x: 68, y: 78, radius: 24, name: 'Κάτω δεξιά' },
  ],
  'Ν': [
    { id: 'bottom_left', x: 34, y: 78, radius: 24, name: 'Κάτω αριστερά' },
    { id: 'top_left', x: 34, y: 34, radius: 24, name: 'Πάνω αριστερά' },
    { id: 'bottom_right', x: 66, y: 78, radius: 24, name: 'Κάτω δεξιά' },
    { id: 'top_right', x: 66, y: 34, radius: 24, name: 'Πάνω δεξιά' },
  ],
  'Ξ': [
    { id: 'top_bar', x: 50, y: 34, radius: 20, name: 'Πάνω γραμμή' },
    { id: 'middle_bar', x: 50, y: 56, radius: 18, name: 'Μεσαία γραμμή' },
    { id: 'bottom_bar', x: 50, y: 78, radius: 20, name: 'Κάτω γραμμή' },
  ],
  'Ο': [
    { id: 'top', x: 50, y: 34, radius: 24, name: 'Πάνω' },
    { id: 'left', x: 32, y: 56, radius: 24, name: 'Αριστερά' },
    { id: 'bottom', x: 50, y: 78, radius: 24, name: 'Κάτω' },
    { id: 'right', x: 68, y: 56, radius: 24, name: 'Δεξιά' },
  ],
  'Π': [
    { id: 'top_left', x: 36, y: 34, radius: 24, name: 'Πάνω αριστερά' },
    { id: 'top_right', x: 64, y: 34, radius: 24, name: 'Πάνω δεξιά' },
    { id: 'bottom_left', x: 36, y: 78, radius: 24, name: 'Κάτω αριστερά' },
    { id: 'bottom_right', x: 64, y: 78, radius: 24, name: 'Κάτω δεξιά' },
  ],
  'Ρ': [
    { id: 'bottom_left', x: 38, y: 78, radius: 24, name: 'Βάση κάθετης' },
    { id: 'top_left', x: 38, y: 34, radius: 24, name: 'Κορυφή κάθετης' },
    { id: 'loop_edge', x: 66, y: 44, radius: 24, name: 'Καμπύλη' },
    { id: 'loop_close', x: 44, y: 56, radius: 18, name: 'Ένωση καμπύλης' },
  ],
  'Σ': [
    { id: 'top_right', x: 64, y: 34, radius: 24, name: 'Πάνω δεξιά' },
    { id: 'top_left', x: 36, y: 34, radius: 24, name: 'Πάνω αριστερά' },
    { id: 'center_corner', x: 50, y: 56, radius: 18, name: 'Μεσαία μύτη' },
    { id: 'bottom_left', x: 36, y: 78, radius: 24, name: 'Κάτω αριστερά' },
    { id: 'bottom_right', x: 64, y: 78, radius: 24, name: 'Κάτω δεξιά' },
  ],
  'Τ': [
    { id: 'top_left', x: 32, y: 34, radius: 24, name: 'Πάνω αριστερά' },
    { id: 'top_right', x: 68, y: 34, radius: 24, name: 'Πάνω δεξιά' },
    { id: 'stem_bottom', x: 50, y: 78, radius: 24, name: 'Βάση' },
  ],
  'Υ': [
    { id: 'top_left', x: 36, y: 34, radius: 24, name: 'Πάνω αριστερά' },
    { id: 'center_fork', x: 50, y: 56, radius: 18, name: 'Ένωση' },
    { id: 'top_right', x: 64, y: 34, radius: 24, name: 'Πάνω δεξιά' },
    { id: 'bottom_stem', x: 50, y: 78, radius: 24, name: 'Βάση' },
  ],
  'Φ': [
    { id: 'top_stem', x: 50, y: 28, radius: 22, name: 'Κορυφή κάθετης' },
    { id: 'bottom_stem', x: 50, y: 84, radius: 22, name: 'Βάση κάθετης' },
    { id: 'left_curve', x: 32, y: 56, radius: 24, name: 'Αριστερή καμπύλη' },
    { id: 'right_curve', x: 68, y: 56, radius: 24, name: 'Δεξιά καμπύλη' },
  ],
  'Χ': [
    { id: 'top_left', x: 34, y: 34, radius: 24, name: 'Πάνω αριστερά' },
    { id: 'bottom_right', x: 66, y: 78, radius: 24, name: 'Κάτω δεξιά' },
    { id: 'top_right', x: 66, y: 34, radius: 24, name: 'Πάνω δεξιά' },
    { id: 'bottom_left', x: 34, y: 78, radius: 24, name: 'Κάτω αριστερά' },
  ],
  'Ψ': [
    { id: 'top_left', x: 32, y: 36, radius: 24, name: 'Αριστερή ακίδα' },
    { id: 'center_fork', x: 50, y: 60, radius: 20, name: 'Βάση τρίαινας' },
    { id: 'top_right', x: 68, y: 36, radius: 24, name: 'Δεξιά ακίδα' },
    { id: 'stem_bottom', x: 50, y: 84, radius: 22, name: 'Βάση κάθετης' },
  ],
  'Ω': [
    { id: 'left_foot', x: 30, y: 78, radius: 24, name: 'Αριστερή βάση' },
    { id: 'left_arch', x: 32, y: 48, radius: 24, name: 'Αριστερή καμάρα' },
    { id: 'top_crown', x: 50, y: 34, radius: 24, name: 'Κορυφή' },
    { id: 'right_arch', x: 68, y: 48, radius: 24, name: 'Δεξιά καμάρα' },
    { id: 'right_foot', x: 70, y: 78, radius: 24, name: 'Δεξιά βάση' },
  ],
};
