import sys, re
with open('src/context/AcademyContext.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

target = """                  createdAt: new Date(Date.now() - 48 * 3600000).toISOString()
                }
              ];
              setAdmissions(mockAdmissions);
              mockAdmissions.forEach(async (adm) => {
                await setDoc(doc(db, 'admissions', adm.id), adm).catch(e => console.warn('Could not init admission:', e));
              });
            }
          }, (err) => {
            console.error('Admissions snapshot error:', err);
          });
        } catch (e) { console.error('Error loading admissions:', e); throw e; }"""

replacement = """      // 6. Load Admissions in Real-time
        try {
          const admissionsRef = collection(db, 'admissions');
          unsubscribeAdmissions = onSnapshot(admissionsRef, (snapshot) => {
            if (!snapshot.empty) {
              const loadedAdmissions: Admission[] = [];
              snapshot.forEach(docSnap => {
                loadedAdmissions.push(docSnap.data() as Admission);
              });
              loadedAdmissions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
              setAdmissions(loadedAdmissions);
            } else {
              setAdmissions([]);
            }
          }, (err) => {
            console.error('Admissions snapshot error:', err);
          });
        } catch (e) { console.error('Error loading admissions:', e); throw e; }"""

new_content = content.replace(target, replacement)

with open('src/context/AcademyContext.tsx', 'w', encoding='utf-8') as f:
    f.write(new_content)
print('Replacement applied successfully.')
