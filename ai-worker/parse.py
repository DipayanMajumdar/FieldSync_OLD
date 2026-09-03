from xerparser import Xer
import psycopg2

def ing(f_p):
    x = Xer(f_p)
    c = psycopg2.connect(dbname="execution_bridge", user="sih_admin", password="sih_password", host="localhost")
    cr = c.cursor()
    p = list(x.projects.values())[0]
    
    cr.execute("INSERT INTO prj (nm) VALUES (%s) RETURNING id", (p.name,))
    pid = cr.fetchone()[0]
    
    for w in p.wbs_nodes:
        cr.execute("INSERT INTO wbs (pid, cd, nm) VALUES (%s, %s, %s)", (pid, w.wbs_code, w.wbs_name))
    
    for t in p.tasks:
        cr.execute("INSERT INTO act (wid, qty, unt) VALUES (%s, %s, %s)", (pid, 0, "pct"))
        
    c.commit()
    cr.close()
    c.close()