/**
 * Έλεγχος Σχεδίασης Γραμμάτων (Letter Tracing Validator)
 *
 * Σχεδιασμένο ειδικά για παιδιά προσχολικής και πρώτης σχολικής ηλικίας (2-8 ετών).
 * 
 * Αρχιτεκτονική Ελέγχου:
 * 1. Letter Corridor (Διάδρομος Γράμματος):
 *    Δημιουργούμε δυναμικά μια διασταλμένη μάσκα του γράμματος (dilated mask) με περιθώριο
 *    ανοχής. Έτσι επιτρέπουμε στο παιδί να σχεδιάζει φυσικά χωρίς να απαιτείται ρομποτική ακρίβεια.
 * 
 * 2. Ανίχνευση Μουτζούρας (Anti-Scribble):
 *    Αν πάνω από το 20% των σχεδιασμένων pixels βγαίνουν έξω από το διάδρομο του γράμματος,
 *    απορρίπτουμε τη σχεδίαση με φιλικό μήνυμα καθοδήγησης.
 * 
 * 3. Σημεία-Κλειδιά (Structural Waypoints):
 *    Ελέγχουμε ότι το παιδί σχεδίασε όλα τα απαραίτητα τμήματα του γράμματος (π.χ. την οριζόντια
 *    γραμμή του Α, τη γωνία του Γ, το πόδι του Ω), ώστε να μην περνάνε ελλιπή γράμματα όπως Λ αντί για Α.
 */

import { LETTER_WAYPOINTS } from '../data/letterWaypoints';

const GRID_SIZE = 16;
const CELL_SIZE_PX = 20;

export function validateLetterDrawing(userCanvas, targetLetter) {
  if (!userCanvas) {
    return { success: false, message: 'Ο καμβάς δεν είναι διαθέσιμος.' };
  }

  const { width, height } = userCanvas;
  const userCtx = userCanvas.getContext('2d');
  const userPixelData = userCtx.getImageData(0, 0, width, height).data;

  // Βήμα 1: Δημιουργία πρότυπης μάσκας του γράμματος σε offscreen canvas
  const templateCanvas = document.createElement('canvas');
  templateCanvas.width = width;
  templateCanvas.height = height;
  const templateCtx = templateCanvas.getContext('2d');

  templateCtx.fillStyle = '#000000';
  templateCtx.font = '900 190px "Fredoka", "Comfortaa", "Comic Sans MS", "Chalkboard SE", system-ui, sans-serif';
  templateCtx.textAlign = 'center';
  templateCtx.textBaseline = 'middle';
  templateCtx.fillText(targetLetter, width / 2, height / 2 + 5);

  const guidePixelData = templateCtx.getImageData(0, 0, width, height).data;

  // Χαρτογράφηση του διαδρόμου του γράμματος σε πλέγμα με περιθώριο ανοχής
  const allowedCorridorCells = new Set();
  let totalGuideInk = 0;

  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      let inkInCell = 0;

      for (let py = row * CELL_SIZE_PX; py < (row + 1) * CELL_SIZE_PX; py += 4) {
        for (let px = col * CELL_SIZE_PX; px < (col + 1) * CELL_SIZE_PX; px += 4) {
          const alphaIndex = (py * width + px) * 4 + 3;
          if (guidePixelData[alphaIndex] > 40) {
            inkInCell++;
            totalGuideInk++;
          }
        }
      }

      // Αν το κελί περιέχει μέρος του γράμματος, συμπεριλαμβάνουμε και τα γειτονικά του κελιά
      if (inkInCell >= 3) {
        for (let dRow = -1; dRow <= 1; dRow++) {
          for (let dCol = -1; dCol <= 1; dCol++) {
            allowedCorridorCells.add(`${row + dRow},${col + dCol}`);
          }
        }
      }
    }
  }

  // Βήμα 2: Σάρωση των γραμμών που σχεδίασε το παιδί
  const userDrawnCells = new Set();
  let totalUserInk = 0;

  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      let drawnInCell = 0;

      for (let py = row * CELL_SIZE_PX; py < (row + 1) * CELL_SIZE_PX; py += 3) {
        for (let px = col * CELL_SIZE_PX; px < (col + 1) * CELL_SIZE_PX; px += 3) {
          const alphaIndex = (py * width + px) * 4 + 3;
          if (userPixelData[alphaIndex] > 30) {
            drawnInCell++;
            totalUserInk++;
          }
        }
      }

      if (drawnInCell >= 4) {
        userDrawnCells.add(`${row},${col}`);
      }
    }
  }

  const activeCells = Array.from(userDrawnCells);

  // Έλεγχος 1: Αν ο καμβάς είναι κενός ή έχει ελάχιστες πινελιές
  if (activeCells.length < 5 || totalUserInk < 120) {
    return {
      success: false,
      reason: 'empty',
      message: 'Σχεδίασε πρώτα το γράμμα με το δάχτυλο! ✍️',
    };
  }

  // Έλεγχος 2: Προστασία από μουτζούρες έξω από το περίγραμμα
  let outOfBoundsCells = 0;
  activeCells.forEach((cellKey) => {
    if (!allowedCorridorCells.has(cellKey)) {
      outOfBoundsCells++;
    }
  });

  const outOfBoundsRatio = outOfBoundsCells / activeCells.length;
  if (outOfBoundsRatio > 0.20) {
    return {
      success: false,
      reason: 'scribble',
      message: 'Ωχ, μουτζούρα έξω από το γράμμα! Προσπάθησε να μείνεις στις γραμμές! 🎨',
    };
  }

  // Έλεγχος 3: Επαλήθευση κρίσιμων σημείων του γράμματος (Waypoints)
  const requiredWaypoints = LETTER_WAYPOINTS[targetLetter] || [];
  const missingWaypoints = [];

  for (const point of requiredWaypoints) {
    const targetX = Math.round((point.x / 100) * width);
    const targetY = Math.round((point.y / 100) * height);
    const searchRadius = point.radius || 18;

    let hasInk = false;

    for (let dy = -searchRadius; dy <= searchRadius; dy += 2) {
      for (let dx = -searchRadius; dx <= searchRadius; dx += 2) {
        if (dx * dx + dy * dy <= searchRadius * searchRadius) {
          const px = targetX + dx;
          const py = targetY + dy;

          if (px >= 0 && px < width && py >= 0 && py < height) {
            const alphaIndex = (py * width + px) * 4 + 3;
            if (userPixelData[alphaIndex] > 30) {
              hasInk = true;
              break;
            }
          }
        }
      }
      if (hasInk) break;
    }

    if (!hasInk) {
      missingWaypoints.push(point);
    }
  }

  // Αν λείπει κάποιο ουσιαστικό κομμάτι του γράμματος
  if (missingWaypoints.length > 0) {
    const firstMissing = missingWaypoints[0];
    return {
      success: false,
      reason: 'missing_waypoint',
      missingWaypoint: firstMissing,
      message: `Ξέχασες το μέρος: «${firstMissing.name}»! Σχεδίασέ το για να ολοκληρωθεί το ${targetLetter}! ✏️`,
    };
  }

  // Όλοι οι έλεγχοι πέτυχαν: Το γράμμα σχεδιάστηκε σωστά και πλήρως!
  return {
    success: true,
    message: 'Μπράβο! Το έγραψες υπέροχα & ολόκληρο! ⭐',
  };
}
