import React, { createContext, useContext, useState, useEffect } from 'react';
import { getCurrentWeekKey } from '../utils/time';

const AuthContext = createContext(null);

const STORAGE_KEY_USER = 'mikroi_mathites_auth_user';
const STORAGE_KEY_ACTIVE_CHILD = 'mikroi_mathites_active_child';
const STORAGE_KEY_USERS_DB = 'mikroi_mathites_registered_users';

// Initial registered kids in community
const SEED_REGISTERED_USERS = [
  {
    id: 'user_seed_1',
    parentName: 'Ελένη Κ.',
    email: 'eleni@example.com',
    children: [
      {
        id: 'child_seed_1',
        name: 'Μαρία',
        age: 5,
        avatar: '🦄',
        stars: 38,
        weeklyStars: 24,
        lastWeekKey: getCurrentWeekKey(),
      },
    ],
  },
  {
    id: 'user_seed_2',
    parentName: 'Κώστας Μ.',
    email: 'kostas@example.com',
    children: [
      {
        id: 'child_seed_2',
        name: 'Αλέξανδρος',
        age: 6,
        avatar: '🚀',
        stars: 31,
        weeklyStars: 19,
        lastWeekKey: getCurrentWeekKey(),
      },
    ],
  },
  {
    id: 'user_seed_3',
    parentName: 'Σοφία Π.',
    email: 'sofia@example.com',
    children: [
      {
        id: 'child_seed_3',
        name: 'Δανάη',
        age: 4,
        avatar: '🐱',
        stars: 25,
        weeklyStars: 14,
        lastWeekKey: getCurrentWeekKey(),
      },
    ],
  },
  {
    id: 'user_seed_4',
    parentName: 'Δημήτρης Τ.',
    email: 'dimitris@example.com',
    children: [
      {
        id: 'child_seed_4',
        name: 'Ορφέας',
        age: 5,
        avatar: '🦖',
        stars: 20,
        weeklyStars: 11,
        lastWeekKey: getCurrentWeekKey(),
      },
    ],
  },
];

export function AuthProvider({ children }) {
  const currentWeek = getCurrentWeekKey();

  // Registered users database in localStorage
  const [registeredUsers, setRegisteredUsers] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_USERS_DB);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.length > 0) return parsed;
      }
      return SEED_REGISTERED_USERS;
    } catch (e) {
      return SEED_REGISTERED_USERS;
    }
  });

  // Current logged in user
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_USER);
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  // Active child profile
  const [activeChild, setActiveChild] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ACTIVE_CHILD);
      return saved
        ? JSON.parse(saved)
        : {
            id: 'guest',
            name: 'Μικρός Μαθητής',
            age: 4,
            avatar: '🎈',
            stars: parseInt(localStorage.getItem('mikroi_mathites_stars') || '0', 10),
            weeklyStars: 0,
            lastWeekKey: currentWeek,
            balloonHighScore: 0,
            memoryWins: 0,
            tracedCount: 0,
            songsCount: 0,
            inventory: [],
          };
    } catch (e) {
      return {
        id: 'guest',
        name: 'Μικρός Μαθητής',
        age: 4,
        avatar: '🎈',
        stars: 0,
        weeklyStars: 0,
        lastWeekKey: currentWeek,
        balloonHighScore: 0,
        memoryWins: 0,
        tracedCount: 0,
        songsCount: 0,
        inventory: [],
      };
    }
  });

  // Save changes to localStorage
  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(currentUser));
      } else {
        localStorage.removeItem(STORAGE_KEY_USER);
      }
    } catch (e) {}
  }, [currentUser]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_ACTIVE_CHILD, JSON.stringify(activeChild));
      if (activeChild) {
        localStorage.setItem('mikroi_mathites_stars', (activeChild.stars || 0).toString());
      }
    } catch (e) {}
  }, [activeChild]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_USERS_DB, JSON.stringify(registeredUsers));
    } catch (e) {}
  }, [registeredUsers]);

  // Register new parent account with first child
  const register = (parentName, email, password, childName, childAge, childAvatar) => {
    const existing = registeredUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      throw new Error('Υπάρχει ήδη λογαριασμός με αυτό το email!');
    }

    const newChild = {
      id: `child_${Date.now()}`,
      name: childName || 'Μικρός Μαθητής',
      age: childAge || 4,
      avatar: childAvatar || '🦁',
      stars: 5, // Welcome bonus stars!
      weeklyStars: 5,
      lastWeekKey: currentWeek,
      balloonHighScore: 0,
      memoryWins: 0,
      tracedCount: 0,
      songsCount: 0,
    };

    const newUser = {
      id: `user_${Date.now()}`,
      parentName,
      email,
      password,
      children: [newChild],
      createdAt: new Date().toISOString(),
    };

    setRegisteredUsers((prev) => [...prev, newUser]);
    setCurrentUser(newUser);
    setActiveChild(newChild);
    return newUser;
  };

  // Login parent
  const login = (email, password) => {
    const found = registeredUsers.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    if (!found) {
      throw new Error('Λάθος email ή κωδικός πρόσβασης!');
    }

    setCurrentUser(found);
    if (found.children && found.children.length > 0) {
      setActiveChild(found.children[0]);
    }
    return found;
  };

  // Logout
  const logout = () => {
    setCurrentUser(null);
    setActiveChild({
      id: 'guest',
      name: 'Μικρός Μαθητής',
      age: 4,
      avatar: '🎈',
      stars: 0,
      weeklyStars: 0,
      lastWeekKey: currentWeek,
      balloonHighScore: 0,
      memoryWins: 0,
      tracedCount: 0,
      songsCount: 0,
    });
  };

  // Switch active child profile
  const switchChild = (childId) => {
    if (!currentUser) return;
    const child = currentUser.children.find((c) => c.id === childId);
    if (child) {
      setActiveChild(child);
    }
  };

  // Add a new child to parent's account
  const addChild = (name, age, avatar) => {
    if (!currentUser) return;

    const newChild = {
      id: `child_${Date.now()}`,
      name,
      age: age || 4,
      avatar: avatar || '🐻',
      stars: 0,
      weeklyStars: 0,
      lastWeekKey: currentWeek,
      balloonHighScore: 0,
      memoryWins: 0,
      tracedCount: 0,
      songsCount: 0,
    };

    const updatedUser = {
      ...currentUser,
      children: [...currentUser.children, newChild],
    };

    setCurrentUser(updatedUser);
    setRegisteredUsers((prev) =>
      prev.map((u) => (u.id === currentUser.id ? updatedUser : u))
    );
    setActiveChild(newChild);
  };

  // Add star to active child with Weekly calculation
  const addStarToActiveChild = () => {
    setActiveChild((prev) => {
      const weekKey = getCurrentWeekKey();
      const isNewWeek = prev.lastWeekKey !== weekKey;
      const currentWeekly = isNewWeek ? 0 : (prev.weeklyStars || 0);

      const updatedChild = {
        ...prev,
        stars: (prev.stars || 0) + 1,
        weeklyStars: currentWeekly + 1,
        lastWeekKey: weekKey,
      };

      if (currentUser) {
        const updatedChildren = currentUser.children.map((c) =>
          c.id === prev.id ? updatedChild : c
        );
        const updatedUser = { ...currentUser, children: updatedChildren };
        setCurrentUser(updatedUser);
        setRegisteredUsers((users) =>
          users.map((u) => (u.id === updatedUser.id ? updatedUser : u))
        );
      }

      return updatedChild;
    });
  };

  // Record specific game stats
  const recordStat = (type, value) => {
    setActiveChild((prev) => {
      let updatedChild = { ...prev };

      if (type === 'balloon') {
        updatedChild.balloonHighScore = Math.max(prev.balloonHighScore || 0, value);
      } else if (type === 'memory') {
        updatedChild.memoryWins = (prev.memoryWins || 0) + 1;
      } else if (type === 'trace') {
        updatedChild.tracedCount = (prev.tracedCount || 0) + 1;
      } else if (type === 'song') {
        updatedChild.songsCount = (prev.songsCount || 0) + 1;
      }

      if (currentUser) {
        const updatedChildren = currentUser.children.map((c) =>
          c.id === prev.id ? updatedChild : c
        );
        const updatedUser = { ...currentUser, children: updatedChildren };
        setCurrentUser(updatedUser);
        setRegisteredUsers((users) =>
          users.map((u) => (u.id === updatedUser.id ? updatedUser : u))
        );
      }

      return updatedChild;
    });
  };

  // Buy item from Star Shop
  const buyItem = (item) => {
    if ((activeChild?.stars || 0) < item.cost) {
      throw new Error(`Χρειάζεσαι ${item.cost} αστέρια για αυτό το αντικείμενο!`);
    }

    const currentInventory = activeChild?.inventory || [];
    if (currentInventory.includes(item.id)) {
      throw new Error('Έχεις ήδη αγοράσει αυτό το αντικείμενο!');
    }

    setActiveChild((prev) => {
      const updatedStars = Math.max(0, (prev.stars || 0) - item.cost);
      const updatedInventory = [...(prev.inventory || []), item.id];
      const updatedChild = {
        ...prev,
        stars: updatedStars,
        inventory: updatedInventory,
        avatar: item.type === 'avatar' ? item.avatar : prev.avatar,
      };

      if (currentUser) {
        const updatedChildren = currentUser.children.map((c) =>
          c.id === prev.id ? updatedChild : c
        );
        const updatedUser = { ...currentUser, children: updatedChildren };
        setCurrentUser(updatedUser);
        setRegisteredUsers((users) =>
          users.map((u) => (u.id === updatedUser.id ? updatedUser : u))
        );
      }

      return updatedChild;
    });
  };

  // Equip unlocked avatar
  const equipAvatar = (avatarEmoji) => {
    setActiveChild((prev) => {
      const updatedChild = { ...prev, avatar: avatarEmoji };

      if (currentUser) {
        const updatedChildren = currentUser.children.map((c) =>
          c.id === prev.id ? updatedChild : c
        );
        const updatedUser = { ...currentUser, children: updatedChildren };
        setCurrentUser(updatedUser);
        setRegisteredUsers((users) =>
          users.map((u) => (u.id === updatedUser.id ? updatedUser : u))
        );
      }

      return updatedChild;
    });
  };

  // Get ONLY registered children for the weekly podium
  const getWeeklyLeaderboard = () => {
    const weekKey = getCurrentWeekKey();
    const list = [];

    registeredUsers.forEach((u) => {
      if (u.children && u.children.length > 0) {
        u.children.forEach((c) => {
          // If stars belong to current week, use weeklyStars, else 0
          const starsThisWeek = c.lastWeekKey === weekKey ? (c.weeklyStars || 0) : 0;
          list.push({
            id: c.id,
            name: c.name,
            avatar: c.avatar,
            weeklyStars: starsThisWeek,
            totalStars: c.stars || 0,
            isCurrent: activeChild?.id === c.id,
          });
        });
      }
    });

    // Sort by weeklyStars descending, then by totalStars
    return list.sort((a, b) => b.weeklyStars - a.weeklyStars || b.totalStars - a.totalStars);
  };

  const isGuest = !currentUser;

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        activeChild,
        isGuest,
        login,
        register,
        logout,
        switchChild,
        addChild,
        addStarToActiveChild,
        recordStat,
        buyItem,
        equipAvatar,
        getWeeklyLeaderboard,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
